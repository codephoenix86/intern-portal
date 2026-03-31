declare class RecruiterProfileService {
    getProfile(recruiterId: string): Promise<{
        name: string;
        email: string;
        companyName: string;
        companyEmail: string;
        avatar: string | null;
    }>;
    patchProfile(recruiterId: string, body: {
        companyName?: string;
        companyEmail?: string | null;
    }): Promise<{
        name: string;
        email: string;
        companyName: string;
        companyEmail: string;
        avatar: string | null;
    }>;
}
export declare const recruiterProfileService: RecruiterProfileService;
export {};
//# sourceMappingURL=recruiter-profile.service.d.ts.map