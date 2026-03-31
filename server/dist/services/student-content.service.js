import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";
import { SKILL_QUESTION_BANK, ROADMAP_FIELD_TEMPLATES, TRENDING_ROADMAP_FIELDS, RECOMMENDED_COURSES, } from "../data/student-content.seed.js";
function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function normalize(text) {
    return text.trim().toLowerCase();
}
class StudentContentService {
    getQuiz(skill, requestedCount) {
        const count = Math.max(15, Math.min(25, requestedCount ?? 15));
        const normalizedSkill = normalize(skill ?? "");
        if (!normalizedSkill) {
            throw new AppError(400, "Skill/topic is required");
        }
        const tokens = normalizedSkill
            .split(/\s+/g)
            .map((t) => t.trim())
            .filter(Boolean);
        const bySkill = SKILL_QUESTION_BANK.filter((q) => {
            const tags = q.tags.map(normalize);
            if (tags.includes(normalizedSkill))
                return true;
            return tokens.some((token) => tags.some((tag) => tag.includes(token)));
        });
        const basePool = bySkill.length > 0 ? bySkill : SKILL_QUESTION_BANK;
        const byType = new Map();
        for (const q of basePool) {
            const list = byType.get(q.type) ?? [];
            list.push(q);
            byType.set(q.type, list);
        }
        const selected = [];
        const selectedIds = new Set();
        // Include at least one question from each available type.
        for (const type of ["concept", "code", "debug", "scenario"]) {
            const group = byType.get(type) ?? [];
            if (group.length === 0)
                continue;
            const pick = shuffle(group)[0];
            if (pick && !selectedIds.has(pick.id)) {
                selected.push(pick);
                selectedIds.add(pick.id);
            }
        }
        for (const q of shuffle(basePool)) {
            if (selected.length >= count)
                break;
            if (selectedIds.has(q.id))
                continue;
            selected.push(q);
            selectedIds.add(q.id);
        }
        // Fallback to full bank if topic pool is smaller than required count.
        for (const q of shuffle(SKILL_QUESTION_BANK)) {
            if (selected.length >= count)
                break;
            if (selectedIds.has(q.id))
                continue;
            selected.push(q);
            selectedIds.add(q.id);
        }
        return {
            questions: selected.slice(0, count).map((q, idx) => ({
                id: idx + 1,
                question: q.question,
                options: q.options,
                correct: q.correct,
                type: q.type,
            })),
        };
    }
    getCourses(fieldsInput) {
        const fields = (fieldsInput ?? [])
            .map((f) => f.trim())
            .filter(Boolean)
            .map((f) => this.resolveFieldName(f));
        if (fields.length === 0) {
            return { courses: RECOMMENDED_COURSES.slice(0, 8) };
        }
        const normalizedFields = fields.map((f) => this.normalizeField(f));
        const matched = RECOMMENDED_COURSES.filter((course) => {
            const tags = (course.tags ?? []).map((tag) => this.normalizeField(tag));
            return normalizedFields.some((field) => tags.includes(field));
        });
        return { courses: matched.length > 0 ? matched : RECOMMENDED_COURSES.slice(0, 8) };
    }
    normalizeField(value) {
        return value.trim().toLowerCase();
    }
    resolveFieldName(input) {
        const normalized = this.normalizeField(input);
        for (const field of TRENDING_ROADMAP_FIELDS) {
            if (this.normalizeField(field) === normalized) {
                return field;
            }
        }
        return input.trim();
    }
    genericTemplate(field) {
        return [
            { title: `Learn ${field} fundamentals`, category: "Foundations" },
            { title: `Build small ${field} practice projects`, category: "Practice" },
            { title: `Complete one intermediate ${field} project`, category: "Projects" },
            { title: `Study interview topics for ${field}`, category: "Interview Prep" },
            { title: `Create a ${field} portfolio showcase`, category: "Portfolio" },
        ];
    }
    buildTasksForFields(fields) {
        const generated = [];
        const dedupe = new Set();
        for (const field of fields) {
            const template = ROADMAP_FIELD_TEMPLATES[field] ?? this.genericTemplate(field);
            template.forEach((step, index) => {
                const key = `${field.toLowerCase()}::${step.title.toLowerCase()}`;
                if (dedupe.has(key))
                    return;
                dedupe.add(key);
                generated.push({
                    id: `${field.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
                    title: step.title,
                    category: `${field} - ${step.category}`,
                });
            });
        }
        return generated;
    }
    fieldsChanged(current, incoming) {
        if (current.length !== incoming.length)
            return true;
        const currentNormalized = current
            .map((f) => this.normalizeField(f))
            .sort();
        const incomingNormalized = incoming
            .map((f) => this.normalizeField(f))
            .sort();
        return currentNormalized.some((v, i) => v !== incomingNormalized[i]);
    }
    async getRoadmap(studentId, fieldsInput) {
        const user = await User.findById(studentId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        const incomingFields = (fieldsInput ?? [])
            .map((f) => f.trim())
            .filter(Boolean)
            .map((f) => this.resolveFieldName(f));
        const currentInterests = user.roadmapInterests ?? [];
        const selectedFields = incomingFields.length > 0
            ? incomingFields
            : currentInterests.length > 0
                ? currentInterests
                : ["Full Stack Development"];
        const shouldRegenerate = !user.roadmapTasks ||
            user.roadmapTasks.length === 0 ||
            this.fieldsChanged(currentInterests, selectedFields);
        if (shouldRegenerate) {
            const previousByTitle = new Map((user.roadmapTasks ?? []).map((task) => [
                task.title.toLowerCase(),
                task.completed,
            ]));
            const nextTasks = this.buildTasksForFields(selectedFields);
            user.roadmapTasks = nextTasks.map((task) => ({
                id: task.id,
                title: task.title,
                category: task.category,
                completed: previousByTitle.get(task.title.toLowerCase()) ?? false,
            }));
            user.roadmapInterests = selectedFields;
            await user.save();
        }
        const tasks = user.roadmapTasks.map((t) => ({
            id: t.id,
            title: t.title,
            category: t.category,
            completed: t.completed,
        }));
        const completedCount = tasks.filter((t) => t.completed).length;
        const totalCount = tasks.length;
        const nextTask = tasks.find((t) => !t.completed)?.title ?? null;
        return {
            availableFields: TRENDING_ROADMAP_FIELDS,
            selectedFields: user.roadmapInterests ?? [],
            tasks,
            summary: {
                total: totalCount,
                completed: completedCount,
                remaining: Math.max(totalCount - completedCount, 0),
                nextTask,
            },
        };
    }
    async toggleRoadmapTask(studentId, taskId) {
        const user = await User.findById(studentId);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        if (!user.roadmapTasks || user.roadmapTasks.length === 0) {
            await this.getRoadmap(studentId);
            const refreshedUser = await User.findById(studentId);
            if (!refreshedUser) {
                throw new AppError(404, "User not found");
            }
            user.roadmapTasks = refreshedUser.roadmapTasks;
            user.roadmapInterests = refreshedUser.roadmapInterests;
        }
        const task = user.roadmapTasks.find((t) => t.id === taskId);
        if (!task) {
            throw new AppError(404, "Task not found");
        }
        task.completed = !task.completed;
        await user.save();
        return this.getRoadmap(studentId, user.roadmapInterests ?? []);
    }
}
export const studentContentService = new StudentContentService();
//# sourceMappingURL=student-content.service.js.map