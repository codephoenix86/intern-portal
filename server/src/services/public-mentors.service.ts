import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { LiveSession } from "../models/live-session.model.js";

/* ────────────────────────────── Types ────────────────────────────── */

export type PublicMentorCard = {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  expertise: string[];
  profileCompletion: number;
  updatedAt: Date;
};

export type PublicMentorCourse = {
  id: string;
  title: string;
  shortDescription: string;
  level: string;
  duration: string;
  skills: string[];
  category: string;
  enrollmentCount: number;
  averageRating: number;
  isFree: boolean;
  slug: string;
};

export type PublicMentorSession = {
  id: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  maxAttendees: number;
  attendeeCount: number;
};

export type PublicMentorProfile = PublicMentorCard & {
  courses: PublicMentorCourse[];
  upcomingSessions: PublicMentorSession[];
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

class PublicMentorsService {
  /**
   * List all public mentor cards with pagination, search & sorting.
   */
  async list(input: {
    page: number;
    limit: number;
    q?: string;
    expertise?: string[];
    sort: "updatedAt" | "name" | "profileCompletion";
    order: "asc" | "desc";
  }): Promise<{
    items: PublicMentorCard[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const { page, limit } = input;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      role: "mentor",
      isActive: true,
    };

    if (input.q) {
      const rx = new RegExp(escapeRegex(input.q), "i");
      filter["name"] = rx;
    }
    if (input.expertise && input.expertise.length > 0) {
      filter["expertise"] = { $all: input.expertise };
    }

    const sortDir = input.order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [input.sort]: sortDir };

    const selectFields = [
      "name",
      "avatar",
      "bio",
      "expertise",
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

    const items: PublicMentorCard[] = docs.map((u) => {
      const out: PublicMentorCard = {
        id: u._id.toString(),
        name: u.name,
        expertise: u.expertise ?? [],
        profileCompletion: u.profileCompletion ?? 0,
        updatedAt: u.updatedAt,
      };

      addIfPresent(out, "avatar", u.avatar);
      addIfPresent(out, "bio", u.bio);

      return out;
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items, page, limit, total, totalPages };
  }

  /**
   * Fetch a single public mentor profile with courses & upcoming sessions.
   */
  async getById(
    mentorId: string,
  ): Promise<{ mentor: PublicMentorProfile } | null> {
    const doc = await User.findOne({
      _id: mentorId,
      role: "mentor",
      isActive: true,
    })
      .select(
        [
          "name",
          "avatar",
          "bio",
          "expertise",
          "profileCompletion",
          "updatedAt",
        ].join(" "),
      )
      .lean();

    if (!doc) return null;

    // ── Fetch published courses by this mentor ──
    let courses: PublicMentorCourse[] = [];
    try {
      const courseDocs = await Course.find({
        mentorId: mentorId,
        isPublished: true,
      })
        .sort({ createdAt: -1 })
        .select(
          "title shortDescription level duration skills category enrollmentCount averageRating pricing slug",
        )
        .lean();

      courses = courseDocs.map((c) => ({
        id: c._id.toString(),
        title: c.title ?? "",
        shortDescription: c.shortDescription ?? "",
        level: c.level ?? "",
        duration: c.duration ?? "",
        skills: c.skills ?? [],
        category: c.category ?? "",
        enrollmentCount: c.enrollmentCount ?? 0,
        averageRating: c.averageRating ?? 0,
        isFree: (c.pricing?.amount ?? 0) === 0,
        slug: c.slug ?? "",
      }));
    } catch (err) {
      console.warn("Could not fetch mentor courses:", err);
    }

    // ── Fetch upcoming sessions by this mentor ──
    let upcomingSessions: PublicMentorSession[] = [];
    try {
      const now = new Date();
      const sessionDocs = await LiveSession.find({
        mentorId: mentorId,
        status: "scheduled",
        scheduledAt: { $gte: now },
      })
        .sort({ scheduledAt: 1 })
        .limit(10)
        .select(
          "topic description date time duration type status maxAttendees attendeeCount",
        )
        .lean();

      upcomingSessions = sessionDocs.map((s) => ({
        id: s._id.toString(),
        topic: s.topic ?? "",
        description: s.description ?? "",
        date: s.date ?? "",
        time: s.time ?? "",
        duration: s.duration ?? 60,
        type: s.type ?? "",
        status: s.status ?? "",
        maxAttendees: s.maxAttendees ?? 0,
        attendeeCount: s.attendeeCount ?? 0,
      }));
    } catch (err) {
      console.warn("Could not fetch mentor sessions:", err);
    }

    const out: PublicMentorProfile = {
      id: doc._id.toString(),
      name: doc.name,
      expertise: doc.expertise ?? [],
      profileCompletion: doc.profileCompletion ?? 0,
      updatedAt: doc.updatedAt,
      courses,
      upcomingSessions,
    };

    addIfPresent(out, "avatar", doc.avatar);
    addIfPresent(out, "bio", doc.bio);

    return { mentor: out };
  }
}

export const publicMentorsService = new PublicMentorsService();
