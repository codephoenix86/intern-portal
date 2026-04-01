export type PublicRecruiterCard = {
    id: string;
    name: string;
    avatar?: string;
    companyName?: string;
    companyEmail?: string;
    location?: string;
    bio?: string;
    profileCompletion: number;
    updatedAt: Date;
};
export type PublicRecruiterJob = {
    id: string;
    title: string;
    company: string;
    location: string;
    workType: string;
    duration: string;
    stipend: string;
    skills: string[];
    postedDate: string;
};
export type PublicRecruiterProfile = PublicRecruiterCard & {
    activeListings: PublicRecruiterJob[];
};
declare class PublicRecruitersService {
    /**
     * List all public recruiter cards with pagination, search & sorting.
     */
    list(input: {
        page: number;
        limit: number;
        q?: string;
        company?: string;
        location?: string;
        sort: "updatedAt" | "name" | "profileCompletion";
        order: "asc" | "desc";
    }): Promise<{
        items: PublicRecruiterCard[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    /**
     * Fetch a single public recruiter profile with active job listings.
     */
    getById(recruiterId: string): Promise<{
        recruiter: PublicRecruiterProfile;
    } | null>;
}
export declare const publicRecruitersService: PublicRecruitersService;
export {};
//# sourceMappingURL=public-recruiters.service.d.ts.map