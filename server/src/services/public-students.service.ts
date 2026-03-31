import { User } from "../models/user.model.js";

export type PublicStudentCard = {
  id: string;
  name: string;
  avatar?: string;
  college?: string;
  branch?: string;
  location?: string;
  bio?: string;
  experienceSummary?: string;
  studentSkills: string[];
  studentProjects: string[];
  achievements: string[];
  codingProfiles?: {
    leetcode?: string;
    codechef?: string;
    codeforces?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  profileCompletion: number;
  updatedAt: Date;
};

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

class PublicStudentsService {
  async list(input: {
    page: number;
    limit: number;
    q?: string;
    college?: string;
    branch?: string;
    location?: string;
    skills?: string[];
    sort: "updatedAt" | "name" | "profileCompletion";
    order: "asc" | "desc";
  }): Promise<{
    items: PublicStudentCard[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const page = input.page;
    const limit = input.limit;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      role: "student",
      isActive: true,
    };

    if (input.q) {
      const rx = new RegExp(escapeRegex(input.q), "i");
      filter["name"] = rx;
    }
    if (input.college) {
      filter["college"] = new RegExp(escapeRegex(input.college), "i");
    }
    if (input.branch) {
      filter["branch"] = new RegExp(escapeRegex(input.branch), "i");
    }
    if (input.location) {
      filter["location"] = new RegExp(escapeRegex(input.location), "i");
    }
    if (input.skills && input.skills.length > 0) {
      filter["studentSkills"] = { $all: input.skills };
    }

    const sortDir = input.order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [input.sort]: sortDir };

    const [total, docs] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          [
            "name",
            "avatar",
            "college",
            "branch",
            "location",
            "bio",
            "experienceSummary",
            "studentSkills",
            "studentProjects",
            "achievements",
            "codingProfiles",
            "profileCompletion",
            "updatedAt",
          ].join(" "),
        )
        .lean(),
    ]);

    const items: PublicStudentCard[] = docs.map((u) => {
      const out: PublicStudentCard = {
        id: u._id.toString(),
        name: u.name,
        studentSkills: u.studentSkills ?? [],
        studentProjects: u.studentProjects ?? [],
        achievements: u.achievements ?? [],
        profileCompletion: u.profileCompletion ?? 0,
        updatedAt: u.updatedAt,
      };

      addIfPresent(out, "avatar", u.avatar);
      addIfPresent(out, "college", u.college);
      addIfPresent(out, "branch", u.branch);
      addIfPresent(out, "location", u.location);
      addIfPresent(out, "bio", (u as unknown as { bio?: string | null }).bio);
      addIfPresent(out, "experienceSummary", u.experienceSummary);

      const coding: NonNullable<PublicStudentCard["codingProfiles"]> = {};
      const cp = u.codingProfiles;
      if (cp) {
        addIfPresent(coding, "leetcode", cp.leetcode);
        addIfPresent(coding, "codechef", cp.codechef);
        addIfPresent(coding, "codeforces", cp.codeforces);
        addIfPresent(coding, "github", cp.github);
        addIfPresent(coding, "linkedin", cp.linkedin);
        addIfPresent(coding, "portfolio", cp.portfolio);
      }
      if (Object.keys(coding).length > 0) {
        out.codingProfiles = coding;
      }

      return out;
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items, page, limit, total, totalPages };
  }
}

export const publicStudentsService = new PublicStudentsService();

