import { type JobWorkType } from "../models/job.model.js";
/** PATCH body for recruiter job updates (avoids `exactOptionalPropertyTypes` issues with Zod). */
export type RecruiterJobUpdateInput = {
    title?: string;
    company?: string;
    location?: string;
    type?: "remote" | "onsite" | "hybrid" | JobWorkType;
    duration?: string;
    stipend?: string;
    skills?: string[];
    description?: string;
    requirements?: string[];
    isActive?: boolean;
};
declare class RecruiterJobService {
    listJobs(recruiterId: string): Promise<{
        jobs: {
            id: string;
            title: string;
            company: string;
            location: string;
            type: JobWorkType;
            duration: string;
            stipend: string;
            skills: string[];
            description: string;
            requirements: string[];
            postedDate: string;
            applicants: number;
            isActive: boolean;
        }[];
    }>;
    getJob(recruiterId: string, jobId: string): Promise<{
        job: {
            id: string;
            title: string;
            company: string;
            location: string;
            type: JobWorkType;
            duration: string;
            stipend: string;
            skills: string[];
            description: string;
            requirements: string[];
            postedDate: string;
            applicants: number;
            isActive: boolean;
        };
    }>;
    createJob(recruiterId: string, body: {
        title: string;
        company: string;
        location: string;
        type: "remote" | "onsite" | "hybrid";
        duration: string;
        stipend: string;
        skills: string[];
        description: string;
        requirements?: string[];
    }): Promise<{
        jobId: string;
    }>;
    updateJob(recruiterId: string, jobId: string, body: RecruiterJobUpdateInput): Promise<{
        jobId: string;
    }>;
    closeJob(recruiterId: string, jobId: string): Promise<{
        jobId: string;
    }>;
}
export declare const recruiterJobService: RecruiterJobService;
export {};
//# sourceMappingURL=recruiter-job.service.d.ts.map