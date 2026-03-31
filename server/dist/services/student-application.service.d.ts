declare class StudentApplicationService {
    listForStudent(studentId: string): Promise<{
        applications: {
            id: string;
            internship: string;
            company: string;
            status: "Applied" | "Screening" | "Interview" | "Offer" | "Rejected";
            date: string;
            matchScore: number;
        }[];
    }>;
    apply(studentId: string, jobId: string): Promise<{
        applicationId: string;
    }>;
}
export declare const studentApplicationService: StudentApplicationService;
export {};
//# sourceMappingURL=student-application.service.d.ts.map