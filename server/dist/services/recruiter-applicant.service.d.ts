declare class RecruiterApplicantService {
    listApplicants(recruiterId: string, filters: {
        status?: string;
    }): Promise<{
        applicants: {
            id: number;
            applicationId: string;
            name: string;
            email: string;
            appliedFor: string;
            matchScore: number;
            skills: string[];
            skillMatch: number;
            experienceMatch: number;
            educationMatch: number;
            status: "Interview" | "Rejected" | "Pending" | "Shortlisted" | "Accepted";
            resumeUrl: string | null;
        }[];
    }>;
    private mapApplicant;
    updateApplicationStatus(recruiterId: string, applicationId: string, status: string): Promise<{
        applicationId: string;
        status: "Interview" | "Rejected" | "Pending" | "Shortlisted" | "Accepted";
    }>;
}
export declare const recruiterApplicantService: RecruiterApplicantService;
export {};
//# sourceMappingURL=recruiter-applicant.service.d.ts.map