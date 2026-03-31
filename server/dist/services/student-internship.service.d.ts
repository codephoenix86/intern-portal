export interface JobListFilters {
    keyword?: string;
    location?: string;
    skills?: string[];
    sort?: "newest" | "match";
}
declare class StudentInternshipService {
    ensureSeededJobs(): Promise<void>;
    private applicantCount;
    listJobs(studentId: string, filters?: JobListFilters): Promise<{
        jobs: {
            id: string;
            title: string;
            company: string;
            location: string;
            type: import("../models/job.model.js").JobWorkType;
            duration: string;
            stipend: string;
            skills: string[];
            description: string;
            requirements: string[];
            postedDate: string;
            applicants: number;
            matchScore: number;
        }[];
    }>;
    getRecommended(studentId: string): Promise<{
        jobs: {
            id: string;
            title: string;
            company: string;
            location: string;
            type: import("../models/job.model.js").JobWorkType;
            duration: string;
            stipend: string;
            skills: string[];
            description: string;
            requirements: string[];
            postedDate: string;
            applicants: number;
            matchScore: number;
        }[];
    }>;
    getJobById(studentId: string, jobId: string): Promise<{
        job: {
            id: string;
            title: string;
            company: string;
            location: string;
            type: import("../models/job.model.js").JobWorkType;
            duration: string;
            stipend: string;
            skills: string[];
            description: string;
            requirements: string[];
            postedDate: string;
            applicants: number;
            matchScore: number;
        };
    }>;
    getMatchScore(studentId: string, jobId: string): Promise<{
        score: number;
    }>;
}
export declare const studentInternshipService: StudentInternshipService;
export {};
//# sourceMappingURL=student-internship.service.d.ts.map