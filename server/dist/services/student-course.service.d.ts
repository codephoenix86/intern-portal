export interface CatalogListQuery {
    keyword?: string | undefined;
    category?: string | undefined;
    page: number;
    limit: number;
}
declare class StudentCourseService {
    /** If there are no published courses but a mentor exists, insert demo catalog rows. */
    ensureCatalogSeeded(): Promise<void>;
    listCatalog(studentId: string, query: CatalogListQuery): Promise<{
        courses: {
            id: string;
            title: string;
            shortDescription: string;
            level: "Beginner" | "Intermediate" | "Advanced";
            duration: string;
            category: string;
            skills: string[];
            thumbnailUrl: string | null;
            enrollmentCount: number;
            pricing: {
                amount: number;
                currency: string;
                discountedAmount: number;
            };
            enrolled: boolean;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getCatalogCourse(studentId: string, courseId: string): Promise<{
        course: {
            id: string;
            title: string;
            description: string;
            shortDescription: string;
            level: "Beginner" | "Intermediate" | "Advanced";
            duration: string;
            category: string;
            skills: string[];
            thumbnailUrl: string | null;
            previewVideoUrl: string | null;
            modules: {
                id: string | undefined;
                title: string;
                duration: string;
                contentType: "link" | "video" | "pdf" | "notes";
                isFree: boolean;
                order: number;
            }[];
            pricing: {
                amount: number;
                currency: string;
                discountPercent: number;
                discountedAmount: number;
            };
            enrollmentCount: number;
            mentorName: string;
        };
        enrolled: boolean;
        enrollment: {
            id: string;
            progress: number;
            status: "completed" | "active" | "dropped";
        } | null;
    }>;
    enroll(studentId: string, courseId: string): Promise<{
        enrollmentId: string;
    }>;
    dropEnrollment(studentId: string, courseId: string): Promise<void>;
    listMyEnrollments(studentId: string): Promise<{
        enrollments: {
            id: string;
            courseId: string;
            title: string;
            shortDescription: string;
            level: "Beginner" | "Intermediate" | "Advanced";
            duration: string;
            category: string;
            skills: string[];
            thumbnailUrl: string | null;
            progress: number;
            status: "completed" | "active" | "dropped";
            enrolledAt: Date;
        }[];
    }>;
}
export declare const studentCourseService: StudentCourseService;
export {};
//# sourceMappingURL=student-course.service.d.ts.map