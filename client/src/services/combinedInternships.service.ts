import { jobService, type InternshipJob } from "@/services/jobService";
import {
  studentPortalService,
  type StudentJobCard,
} from "@/services/studentPortal.service";

export type CombinedInternship = InternshipJob & {
  source: "scraped" | "recruiter";
};

const normalizeText = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const toKey = (job: Pick<InternshipJob, "title" | "company" | "location">): string =>
  `${normalizeText(job.title)}|${normalizeText(job.company)}|${normalizeText(job.location)}`;

const fromStudentJob = (job: StudentJobCard): CombinedInternship => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  type: job.type,
  duration: job.duration,
  stipend: job.stipend,
  skills: job.skills,
  postedDate: job.postedDate,
  applicants: job.applicants,
  matchScore: job.matchScore,
  description: job.description,
  requirements: job.requirements,
  applyUrl: undefined,
  source: "recruiter",
});

const fromScraped = (job: InternshipJob): CombinedInternship => ({
  ...job,
  source: "scraped",
});

export const combinedInternshipsService = {
  /**
   * Returns both recruiter-posted (DB) + web-scraped internships.
   * If student API is unauthorized (not logged in), we still return scraped.
   */
  list: async (filters?: {
    keyword?: string;
    location?: string;
    limit?: number;
  }): Promise<{ items: CombinedInternship[]; sourceWarnings: string[] }> => {
    const [scraped, studentJobs] = await Promise.all([
      jobService.getJobs(filters),
      studentPortalService
        .getJobs({
          keyword: filters?.keyword,
          location: filters?.location,
          sort: "newest",
        })
        .then((jobs) => ({ ok: true as const, jobs }))
        .catch(() => ({ ok: false as const, jobs: [] as StudentJobCard[] })),
    ]);

    const merged: CombinedInternship[] = [];
    const seenIds = new Set<string>();
    const seenKeys = new Set<string>();

    // Prefer recruiter jobs first (so detail pages get richer description/requirements)
    for (const j of studentJobs.jobs) {
      const item = fromStudentJob(j);
      merged.push(item);
      seenIds.add(item.id);
      seenKeys.add(toKey(item));
    }

    for (const s of scraped.data) {
      const item = fromScraped(s);
      const key = toKey(item);
      if (seenIds.has(item.id)) continue;
      if (seenKeys.has(key)) continue;
      merged.push(item);
      seenIds.add(item.id);
      seenKeys.add(key);
    }

    return { items: merged, sourceWarnings: scraped.sourceWarnings };
  },
};

