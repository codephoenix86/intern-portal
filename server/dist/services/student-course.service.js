import { Types } from "mongoose";
import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "./auth.service.js";
import { notificationService } from "./notification.service.js";
import { CATALOG_COURSE_SEED_TEMPLATES } from "../data/catalog-course-seeds.js";
class StudentCourseService {
    /** If there are no published courses but a mentor exists, insert demo catalog rows. */
    async ensureCatalogSeeded() {
        const published = await Course.countDocuments({ isPublished: true });
        if (published > 0)
            return;
        const mentor = await User.findOne({ role: "mentor" }).select("_id").lean();
        if (!mentor)
            return;
        for (const tmpl of CATALOG_COURSE_SEED_TEMPLATES) {
            await Course.create({
                ...tmpl,
                mentorId: mentor._id,
                isPublished: true,
                publishedAt: new Date(),
            });
        }
    }
    async listCatalog(studentId, query) {
        await this.ensureCatalogSeeded();
        const filter = { isPublished: true };
        if (query.category && query.category !== "all") {
            const esc = query.category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.category = new RegExp(esc, "i");
        }
        if (query.keyword?.trim()) {
            const kw = query.keyword.trim();
            const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [
                { title: re },
                { description: re },
                { shortDescription: re },
                { skills: re },
                { category: re },
            ];
        }
        const skip = (query.page - 1) * query.limit;
        const [courses, total] = await Promise.all([
            Course.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(query.limit)
                .lean(),
            Course.countDocuments(filter),
        ]);
        const courseIds = courses.map((c) => c._id);
        const enrolledRows = courseIds.length === 0
            ? []
            : await Enrollment.find({
                studentId: new Types.ObjectId(studentId),
                courseId: { $in: courseIds },
                status: { $ne: "dropped" },
            })
                .select("courseId")
                .lean();
        const enrolledSet = new Set(enrolledRows.map((e) => e.courseId.toString()));
        const items = courses.map((c) => ({
            id: c._id.toString(),
            title: c.title,
            shortDescription: c.shortDescription,
            level: c.level,
            duration: c.duration,
            category: c.category,
            skills: c.skills,
            thumbnailUrl: c.thumbnailUrl,
            enrollmentCount: c.enrollmentCount,
            pricing: {
                amount: c.pricing.amount,
                currency: c.pricing.currency,
                discountedAmount: c.pricing.discountedAmount,
            },
            enrolled: enrolledSet.has(c._id.toString()),
        }));
        const totalPages = Math.max(1, Math.ceil(total / query.limit));
        return {
            courses: items,
            total,
            page: query.page,
            totalPages,
        };
    }
    async getCatalogCourse(studentId, courseId) {
        await this.ensureCatalogSeeded();
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError(400, "Invalid course id");
        }
        const course = await Course.findOne({
            _id: courseId,
            isPublished: true,
        }).lean();
        if (!course) {
            throw new AppError(404, "Course not found");
        }
        const enrollment = await Enrollment.findOne({
            studentId,
            courseId,
            status: { $ne: "dropped" },
        }).lean();
        const mentor = await User.findById(course.mentorId).select("name").lean();
        return {
            course: {
                id: course._id.toString(),
                title: course.title,
                description: course.description,
                shortDescription: course.shortDescription,
                level: course.level,
                duration: course.duration,
                category: course.category,
                skills: course.skills,
                thumbnailUrl: course.thumbnailUrl,
                previewVideoUrl: course.previewVideoUrl,
                modules: course.modules.map((m) => ({
                    id: m._id?.toString(),
                    title: m.title,
                    duration: m.duration,
                    contentType: m.contentType,
                    isFree: m.isFree,
                    order: m.order,
                })),
                pricing: {
                    amount: course.pricing.amount,
                    currency: course.pricing.currency,
                    discountPercent: course.pricing.discountPercent,
                    discountedAmount: course.pricing.discountedAmount,
                },
                enrollmentCount: course.enrollmentCount,
                mentorName: mentor?.name ?? "Instructor",
            },
            enrolled: Boolean(enrollment),
            enrollment: enrollment
                ? {
                    id: enrollment._id.toString(),
                    progress: enrollment.progress,
                    status: enrollment.status,
                }
                : null,
        };
    }
    async enroll(studentId, courseId) {
        await this.ensureCatalogSeeded();
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError(400, "Invalid course id");
        }
        const course = await Course.findById(courseId);
        if (!course || !course.isPublished) {
            throw new AppError(404, "Course not found");
        }
        const existing = await Enrollment.findOne({ studentId, courseId });
        if (existing) {
            if (existing.status === "active" || existing.status === "completed") {
                throw new AppError(400, "Already enrolled in this course");
            }
            if (existing.status === "dropped") {
                existing.status = "active";
                existing.enrolledAt = new Date();
                existing.lastAccessedAt = new Date();
                await existing.save();
                await Course.updateOne({ _id: course._id }, { $inc: { enrollmentCount: 1 } });
                const student = await User.findById(studentId).select("name").lean();
                await notificationService.create({
                    userId: studentId,
                    title: "Enrollment confirmed",
                    message: `You re-enrolled in ${course.title}.`,
                    type: "course_enrolled",
                    link: `/student/courses/${courseId}`,
                });
                await notificationService.create({
                    userId: course.mentorId,
                    title: "Student re-enrolled",
                    message: `${student?.name ?? "A student"} re-enrolled in ${course.title}.`,
                    type: "course_enrolled",
                    metadata: { courseId },
                });
                return { enrollmentId: existing._id.toString() };
            }
        }
        const moduleProgress = course.modules.map((m) => {
            const sub = m;
            if (!sub._id) {
                throw new AppError(500, "Course modules are missing ids");
            }
            return {
                moduleId: sub._id,
                completed: false,
                completedAt: null,
                timeSpent: 0,
            };
        });
        const isFree = course.pricing.amount === 0;
        const created = await Enrollment.create({
            studentId,
            courseId: course._id,
            mentorId: course.mentorId,
            moduleProgress,
            paymentStatus: isFree ? "free" : "pending",
            paymentAmount: isFree ? 0 : course.pricing.discountedAmount,
            status: "active",
        });
        await Course.updateOne({ _id: course._id }, { $inc: { enrollmentCount: 1 } });
        const student = await User.findById(studentId).select("name").lean();
        await notificationService.create({
            userId: studentId,
            title: "Enrollment confirmed",
            message: `You enrolled in ${course.title}.`,
            type: "course_enrolled",
            link: `/student/courses/${courseId}`,
        });
        await notificationService.create({
            userId: course.mentorId,
            title: "New enrollment",
            message: `${student?.name ?? "A student"} enrolled in ${course.title}.`,
            type: "course_enrolled",
            metadata: { courseId },
        });
        return { enrollmentId: created._id.toString() };
    }
    async dropEnrollment(studentId, courseId) {
        if (!Types.ObjectId.isValid(courseId)) {
            throw new AppError(400, "Invalid course id");
        }
        const enrollment = await Enrollment.findOne({ studentId, courseId });
        if (!enrollment || enrollment.status === "dropped") {
            throw new AppError(404, "Enrollment not found");
        }
        if (enrollment.status === "completed") {
            throw new AppError(400, "Cannot leave a completed course");
        }
        enrollment.status = "dropped";
        await enrollment.save();
        const course = await Course.findById(courseId);
        if (course && course.enrollmentCount > 0) {
            course.enrollmentCount -= 1;
            await course.save();
        }
    }
    async listMyEnrollments(studentId) {
        await this.ensureCatalogSeeded();
        const rows = await Enrollment.find({
            studentId,
            status: { $in: ["active", "completed"] },
        })
            .sort({ enrolledAt: -1 })
            .lean();
        const courseIds = rows.map((r) => r.courseId);
        const courses = await Course.find({ _id: { $in: courseIds } })
            .select("title shortDescription level duration category skills thumbnailUrl")
            .lean();
        const byId = new Map(courses.map((c) => [c._id.toString(), c]));
        return {
            enrollments: rows.map((e) => {
                const c = byId.get(e.courseId.toString());
                return {
                    id: e._id.toString(),
                    courseId: e.courseId.toString(),
                    title: c?.title ?? "Course",
                    shortDescription: c?.shortDescription ?? "",
                    level: c?.level ?? "Beginner",
                    duration: c?.duration ?? "",
                    category: c?.category ?? "",
                    skills: c?.skills ?? [],
                    thumbnailUrl: c?.thumbnailUrl ?? null,
                    progress: e.progress,
                    status: e.status,
                    enrolledAt: e.enrolledAt,
                };
            }),
        };
    }
}
export const studentCourseService = new StudentCourseService();
//# sourceMappingURL=student-course.service.js.map