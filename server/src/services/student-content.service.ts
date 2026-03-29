import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";
import {
  SKILL_QUESTION_BANK,
  type SkillQuestionSeed,
  type SkillQuestionType,
  DEFAULT_ROADMAP_TASKS,
  RECOMMENDED_COURSES,
} from "../data/student-content.seed.js";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

class StudentContentService {
  getQuiz(skill: string | undefined, requestedCount: number | undefined) {
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
      if (tags.includes(normalizedSkill)) return true;
      return tokens.some((token) => tags.some((tag) => tag.includes(token)));
    });

    const basePool = bySkill.length > 0 ? bySkill : SKILL_QUESTION_BANK;

    const byType = new Map<SkillQuestionType, SkillQuestionSeed[]>();
    for (const q of basePool) {
      const list = byType.get(q.type) ?? [];
      list.push(q);
      byType.set(q.type, list);
    }

    const selected: SkillQuestionSeed[] = [];
    const selectedIds = new Set<number>();

    // Include at least one question from each available type.
    for (const type of ["concept", "code", "debug", "scenario"] as const) {
      const group = byType.get(type) ?? [];
      if (group.length === 0) continue;
      const pick = shuffle(group)[0];
      if (pick && !selectedIds.has(pick.id)) {
        selected.push(pick);
        selectedIds.add(pick.id);
      }
    }

    for (const q of shuffle(basePool)) {
      if (selected.length >= count) break;
      if (selectedIds.has(q.id)) continue;
      selected.push(q);
      selectedIds.add(q.id);
    }

    // Fallback to full bank if topic pool is smaller than required count.
    for (const q of shuffle(SKILL_QUESTION_BANK)) {
      if (selected.length >= count) break;
      if (selectedIds.has(q.id)) continue;
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

  getCourses() {
    return { courses: RECOMMENDED_COURSES };
  }

  async getRoadmap(studentId: string) {
    const user = await User.findById(studentId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.roadmapTasks || user.roadmapTasks.length === 0) {
      user.roadmapTasks = DEFAULT_ROADMAP_TASKS.map((t) => ({ ...t }));
      await user.save();
    }

    return {
      tasks: user.roadmapTasks.map((t) => ({
        id: Number.parseInt(t.id, 10) || t.id,
        title: t.title,
        category: t.category,
        completed: t.completed,
      })),
    };
  }

  async toggleRoadmapTask(studentId: string, taskId: string) {
    const user = await User.findById(studentId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.roadmapTasks || user.roadmapTasks.length === 0) {
      user.roadmapTasks = DEFAULT_ROADMAP_TASKS.map((t) => ({ ...t }));
    }

    const task = user.roadmapTasks.find((t) => t.id === taskId);
    if (!task) {
      throw new AppError(404, "Task not found");
    }
    task.completed = !task.completed;
    await user.save();

    return this.getRoadmap(studentId);
  }
}

export const studentContentService = new StudentContentService();
