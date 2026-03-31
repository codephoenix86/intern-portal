export interface InternshipRecord {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    duration: string;
    stipend: string;
    skills: string[];
    postedDate: string;
    applicants: number;
    matchScore?: number;
    applyUrl?: string;
    source: string;
}
interface InternshipSearchParams {
    keyword?: string;
    location?: string;
    limit?: number;
}
export declare const internshipScraperService: {
    search: (params: InternshipSearchParams) => Promise<{
        internships: InternshipRecord[];
        sourceWarnings: string[];
    }>;
};
export {};
//# sourceMappingURL=internship-scraper.service.d.ts.map