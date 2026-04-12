import type { z } from "zod";
import type { createMentorCourseSchema, updateMentorCourseSchema, addCourseModuleSchema, updateCourseModuleSchema } from "../validators/mentor-course.validator.js";
type CreateMentorCourseInput = z.infer<typeof createMentorCourseSchema>;
type UpdateMentorCourseInput = z.infer<typeof updateMentorCourseSchema>;
type AddModuleInput = z.infer<typeof addCourseModuleSchema>;
type UpdateModuleInput = z.infer<typeof updateCourseModuleSchema>;
declare class MentorCourseService {
    listMyCourses(mentorId: string): Promise<{
        courses: {
            id: string;
            title: string;
            shortDescription: string;
            level: "Beginner" | "Intermediate" | "Advanced";
            duration: string;
            category: string;
            isPublished: boolean;
            enrollmentCount: number;
            moduleCount: number;
            updatedAt: Date;
        }[];
    }>;
    getCourse(mentorId: string, courseId: string): Promise<{
        course: {
            id: string;
            title: string;
            description: string;
            shortDescription: string;
            level: string;
            duration: string;
            skills: string[];
            category: string;
            thumbnailUrl: string | null;
            previewVideoUrl: string | null;
            pricing: {
                amount: number;
                currency: string;
                discountPercent: number;
                discountedAmount: number;
            };
            isPublished: boolean;
            publishedAt: Date | null;
            enrollmentCount: number;
            modules: {
                id: string | undefined;
                title: string;
                description: string;
                contentUrl: string | null;
                contentType: string;
                duration: string;
                order: number;
                isFree: boolean;
            }[];
        };
    }>;
    private serializeCourseDetail;
    createCourse(mentorId: string, input: CreateMentorCourseInput): Promise<{
        courseId: string;
    }>;
    updateCourse(mentorId: string, courseId: string, input: UpdateMentorCourseInput): Promise<{
        courseId: string;
    }>;
    addModule(mentorId: string, courseId: string, input: AddModuleInput): Promise<{
        moduleId: string;
    }>;
    updateModule(mentorId: string, courseId: string, moduleId: string, input: UpdateModuleInput): Promise<{
        moduleId: string;
    }>;
    setModuleContentUrlFromUpload(mentorId: string, courseId: string, moduleId: string, publicUrl: string): Promise<{
        moduleId: string;
    }>;
    listEnrolledStudents(mentorId: string, courseId: string): Promise<{
        courseTitle: string;
        students: {
            enrollmentId: string;
            studentId: string;
            name: string;
            email: string;
            avatar: string | null;
            progress: number;
            status: "completed" | "active" | "dropped";
            enrolledAt: Date;
        }[];
    }>;
}
export declare const mentorCourseService: MentorCourseService;
export {};
//# sourceMappingURL=mentor-course.service.d.ts.map