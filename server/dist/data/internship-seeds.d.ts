import type { JobWorkType } from "../models/job.model.js";
export interface InternshipSeed {
    title: string;
    company: string;
    location: string;
    workType: JobWorkType;
    duration: string;
    stipend: string;
    skills: string[];
    description: string;
    requirements: string[];
}
export declare const INTERNSHIP_SEEDS: InternshipSeed[];
//# sourceMappingURL=internship-seeds.d.ts.map