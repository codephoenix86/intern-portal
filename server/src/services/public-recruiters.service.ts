import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

/* ────────────────────────────── Types ────────────────────────────── */

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

/* ────────────────────────────── Helpers ──────────────────────────── */

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addIfPresent<T extends Record<string, unknown>>(
  target: T,
  key: string,
  value: unknown,
): void {
  if (value === null || value === undefined) return;
  target[key as keyof T] = value as T[keyof T];
}

/* ────────────────────────────── Service ──────────────────────────── */

class PublicRecruitersService {
  /**
   * List all public recruiter cards with pagination, search & sorting.
   */
  async list(input: {
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
  }> {
    const { page, limit } = input;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      role: "recruiter",
      isActive: true,
    };

    if (input.q) {
      const rx = new RegExp(escapeRegex(input.q), "i");
      filter["$or"] = [{ name: rx }, { companyName: rx }];
    }
    if (input.company) {
      filter["companyName"] = new RegExp(escapeRegex(input.company), "i");
    }
    if (input.location) {
      filter["location"] = new RegExp(escapeRegex(input.location), "i");
    }

    const sortDir = input.order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [input.sort]: sortDir };

    const selectFields = [
      "name",
      "avatar",
      "companyName",
      "companyEmail",
      "location",
      "bio",
      "profileCompletion",
      "updatedAt",
    ].join(" ");

    const [total, docs] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(selectFields)
        .lean(),
    ]);

    const items: PublicRecruiterCard[] = docs.map((u) => {
      const out: PublicRecruiterCard = {
        id: u._id.toString(),
        name: u.name,
        profileCompletion: u.profileCompletion ?? 0,
        updatedAt: u.updatedAt,
      };

      addIfPresent(out, "avatar", u.avatar);
      addIfPresent(out, "companyName", u.companyName);
      addIfPresent(out, "companyEmail", u.companyEmail);
      addIfPresent(out, "location", u.location);
      addIfPresent(out, "bio", u.bio);

      return out;
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items, page, limit, total, totalPages };
  }

  /**
   * Fetch a single public recruiter profile with active job listings.
   */
  async getById(
    recruiterId: string,
  ): Promise<{ recruiter: PublicRecruiterProfile } | null> {
    const doc = await User.findOne({
      _id: recruiterId,
      role: "recruiter",
      isActive: true,
    })
      .select(
        [
          "name",
          "avatar",
          "companyName",
          "companyEmail",
          "location",
          "bio",
          "profileCompletion",
          "updatedAt",
        ].join(" "),
      )
      .lean();

    if (!doc) return null;

    // Fetch active job listings posted by this recruiter
    let activeListings: PublicRecruiterJob[] = [];
    try {
      const jobs = await Job.find({
        recruiterId: recruiterId,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .select(
          "title company location workType duration stipend skills createdAt",
        )
        .lean();

      activeListings = jobs.map((j) => ({
        id: j._id.toString(),
        title: j.title ?? "",
        company: j.company ?? "",
        location: j.location ?? "",
        workType: j.workType ?? "",
        duration: j.duration ?? "",
        stipend: j.stipend ?? "",
        skills: j.skills ?? [],
        postedDate: j.createdAt ? j.createdAt.toISOString() : "",
      }));
    } catch (err) {
      console.warn("Could not fetch recruiter jobs:", err);
    }

    const out: PublicRecruiterProfile = {
      id: doc._id.toString(),
      name: doc.name,
      profileCompletion: doc.profileCompletion ?? 0,
      updatedAt: doc.updatedAt,
      activeListings,
    };

    addIfPresent(out, "avatar", doc.avatar);
    addIfPresent(out, "companyName", doc.companyName);
    addIfPresent(out, "companyEmail", doc.companyEmail);
    addIfPresent(out, "location", doc.location);
    addIfPresent(out, "bio", doc.bio);

    return { recruiter: out };
  }
}

export const publicRecruitersService = new PublicRecruitersService();
