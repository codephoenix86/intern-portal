declare class StudentDashboardService {
    getDashboard(studentId: string): Promise<{
        student: {
            applicationsSubmitted: number;
            interviewsScheduled: number;
            profileViews: number;
            matchScore: number;
        };
    }>;
}
export declare const studentDashboardService: StudentDashboardService;
export {};
//# sourceMappingURL=student-dashboard.service.d.ts.map