declare class StudentProfileService {
    private recomputeProfileCompletion;
    getProfile(studentId: string): Promise<{
        name: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        bio: string | null;
        role: string;
        college: string | null;
        branch: string | null;
        location: string | null;
        cgpa: string | null;
        semester: string | null;
        experienceSummary: string | null;
        profileCompletion: number;
        studentSkills: string[];
        studentProjects: string[];
        achievements: string[];
        targetJobRole: string | null;
        targetSalary: number | null;
        targetCompanies: string[];
        codingProfiles: {
            leetcode: string | null;
            codechef: string | null;
            codeforces: string | null;
            github: string | null;
            linkedin: string | null;
            portfolio: string | null;
        };
        resumeUrl: string | null;
        parsedResume: Record<string, unknown> | null;
        updatedAt: Date;
    }>;
    updateProfile(studentId: string, input: {
        name?: string;
        phone?: string | null;
        avatar?: string | null;
        bio?: string | null;
        college?: string | null;
        branch?: string | null;
        location?: string | null;
        cgpa?: string | null;
        semester?: string | null;
        experienceSummary?: string | null;
        studentSkills?: string[];
        studentProjects?: string[];
        achievements?: string[];
        targetJobRole?: string | null;
        targetSalary?: number | null;
        targetCompanies?: string[];
        codingProfiles?: {
            leetcode?: string | null;
            codechef?: string | null;
            codeforces?: string | null;
            github?: string | null;
            linkedin?: string | null;
            portfolio?: string | null;
        };
    }): Promise<{
        name: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        bio: string | null;
        role: string;
        college: string | null;
        branch: string | null;
        location: string | null;
        cgpa: string | null;
        semester: string | null;
        experienceSummary: string | null;
        profileCompletion: number;
        studentSkills: string[];
        studentProjects: string[];
        achievements: string[];
        targetJobRole: string | null;
        targetSalary: number | null;
        targetCompanies: string[];
        codingProfiles: {
            leetcode: string | null;
            codechef: string | null;
            codeforces: string | null;
            github: string | null;
            linkedin: string | null;
            portfolio: string | null;
        };
        resumeUrl: string | null;
        parsedResume: Record<string, unknown> | null;
        updatedAt: Date;
    }>;
    setResume(studentId: string, resumeUrl: string, parsedResume: Record<string, unknown> | null): Promise<{
        resumeUrl: string;
        parsedResume: Record<string, unknown> | null;
    }>;
    /**
     * Placeholder parser — swap for real PDF/text extraction later.
     */
    parseResumeStub(studentName: string, studentEmail: string): {
        name: string;
        email: string;
        phone: string | null;
        education: Array<{
            degree: string;
            institution: string;
            year: string;
            gpa: string;
        }>;
        skills: string[];
        experience: Array<{
            title: string;
            company: string;
            duration: string;
        }>;
        projects: Array<{
            name: string;
            tech: string;
        }>;
        _note: string;
    };
}
export declare const studentProfileService: StudentProfileService;
export {};
//# sourceMappingURL=student-profile.service.d.ts.map