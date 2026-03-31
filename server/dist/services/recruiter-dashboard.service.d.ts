import type { RecruiterApplicationStatus } from "../utils/recruiter-status.utils.js";
declare class RecruiterDashboardService {
    getDashboard(recruiterId: string): Promise<{
        recruiter: {
            activeListings: number;
            totalApplicants: number;
            shortlisted: number;
            interviewsScheduled: number;
        };
        statusBreakdown: {
            name: RecruiterApplicationStatus;
            value: number;
        }[];
    }>;
    private emptyBreakdown;
    private buildStatusBreakdown;
}
export declare const recruiterDashboardService: RecruiterDashboardService;
export {};
//# sourceMappingURL=recruiter-dashboard.service.d.ts.map