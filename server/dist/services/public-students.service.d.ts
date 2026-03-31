export type PublicStudentCard = {
    id: string;
    name: string;
    avatar?: string;
    college?: string;
    branch?: string;
    location?: string;
    bio?: string;
    experienceSummary?: string;
    studentSkills: string[];
    studentProjects: string[];
    achievements: string[];
    codingProfiles?: {
        leetcode?: string;
        codechef?: string;
        codeforces?: string;
        github?: string;
        linkedin?: string;
        portfolio?: string;
    };
    profileCompletion: number;
    updatedAt: Date;
};
export type PublicStudentProfile = PublicStudentCard;
declare class PublicStudentsService {
    list(input: {
        page: number;
        limit: number;
        q?: string;
        college?: string;
        branch?: string;
        location?: string;
        skills?: string[];
        sort: "updatedAt" | "name" | "profileCompletion";
        order: "asc" | "desc";
    }): Promise<{
        items: PublicStudentCard[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    getById(studentId: string): Promise<{
        student: PublicStudentProfile;
    } | null>;
}
export declare const publicStudentsService: PublicStudentsService;
export {};
//# sourceMappingURL=public-students.service.d.ts.map