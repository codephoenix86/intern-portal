import { Types } from "mongoose";
import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { AppError } from "./auth.service.js";
import type { z } from "zod";
import type {
  createMentorCourseSchema,
  updateMentorCourseSchema,
  addCourseModuleSchema,
  updateCourseModuleSchema,
} from "../validators/mentor-course.validator.js";

type CreateMentorCourseInput = z.infer<typeof createMentorCourseSchema>;
type UpdateMentorCourseInput = z.infer<typeof updateMentorCourseSchema>;
type AddModuleInput = z.infer<typeof addCourseModuleSchema>;
type UpdateModuleInput = z.infer<typeof updateCourseModuleSchema>;

function assertOwnCourse(
  mentorId: string,
  course: { mentorId: Types.ObjectId } | null,
): asserts course is NonNullable<typeof course> {
  if (!course) {
    throw new AppError(404, "Course not found");
  }
  if (course.mentorId.toString() !== mentorId) {
    throw new AppError(403, "Not allowed to manage this course");
  }
}

class MentorCourseService {
  async listMyCourses(mentorId: string) {
    const courses = await Course.find({ mentorId })
      .sort({ updatedAt: -1 })
      .lean();

    return {
      courses: courses.map((c) => ({
        id: c._id.toString(),
        title: c.title,
        shortDescription: c.shortDescription,
        level: c.level,
        duration: c.duration,
        category: c.category,
        isPublished: c.isPublished,
        enrollmentCount: c.enrollmentCount,
        moduleCount: c.modules.length,
        updatedAt: c.updatedAt,
      })),
    };
  }

  async getCourse(mentorId: string, courseId: string) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new AppError(400, "Invalid course id");
    }
    const course = await Course.findById(courseId).lean();
    assertOwnCourse(mentorId, course);

    return {
      course: this.serializeCourseDetail(course),
    };
  }

  private serializeCourseDetail(c: {
    _id: Types.ObjectId;
    title: string;
    description: string;
    shortDescription: string;
    level: string;
    duration: string;
    skills: string[];
    category: string;
    modules: Array<{
      _id?: Types.ObjectId;
      title: string;
      description: string;
      contentUrl: string | null;
      contentType: string;
      duration: string;
      order: number;
      isFree: boolean;
    }>;
    thumbnailUrl: string | null;
    previewVideoUrl: string | null;
    pricing: {
      amount: number;
      currency: string;
      discountPercent: number;
      discountedAmount: number;
    };
    isPublished: boolean;
    publishedAt: Date | null;
    enrollmentCount: number;
  }) {
    return {
      id: c._id.toString(),
      title: c.title,
      description: c.description,
      shortDescription: c.shortDescription,
      level: c.level,
      duration: c.duration,
      skills: c.skills,
      category: c.category,
      thumbnailUrl: c.thumbnailUrl,
      previewVideoUrl: c.previewVideoUrl,
      pricing: c.pricing,
      isPublished: c.isPublished,
      publishedAt: c.publishedAt,
      enrollmentCount: c.enrollmentCount,
      modules: [...c.modules]
        .sort((a, b) => a.order - b.order)
        .map((m) => ({
          id: m._id?.toString(),
          title: m.title,
          description: m.description,
          contentUrl: m.contentUrl,
          contentType: m.contentType,
          duration: m.duration,
          order: m.order,
          isFree: m.isFree,
        })),
    };
  }

  async createCourse(mentorId: string, input: CreateMentorCourseInput) {
    const pricing = input.pricing ?? {
      amount: 0,
      currency: "INR" as const,
      discountPercent: 0,
    };

    const isPublished = input.isPublished ?? false;
    const doc = await Course.create({
      mentorId,
      title: input.title,
      description: input.description,
      shortDescription: input.shortDescription ?? "",
      level: input.level,
      duration: input.duration,
      skills: input.skills ?? [],
      category: input.category,
      modules: [],
      thumbnailUrl: null,
      previewVideoUrl: null,
      pricing: {
        amount: pricing.amount,
        currency: pricing.currency ?? "INR",
        discountPercent: pricing.discountPercent ?? 0,
        discountedAmount: pricing.amount,
      },
      isPublished,
      publishedAt: isPublished ? new Date() : null,
      enrollmentCount: 0,
      completionCount: 0,
      averageRating: 0,
      totalRatings: 0,
    });

    return { courseId: doc._id.toString() };
  }

  async updateCourse(
    mentorId: string,
    courseId: string,
    input: UpdateMentorCourseInput,
  ) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new AppError(400, "Invalid course id");
    }
    const course = await Course.findById(courseId);
    assertOwnCourse(mentorId, course);

    if (input.title !== undefined) course.title = input.title;
    if (input.description !== undefined) course.description = input.description;
    if (input.shortDescription !== undefined) {
      course.shortDescription = input.shortDescription;
    }
    if (input.level !== undefined) course.level = input.level;
    if (input.duration !== undefined) course.duration = input.duration;
    if (input.skills !== undefined) course.skills = input.skills;
    if (input.category !== undefined) course.category = input.category;
    if (input.thumbnailUrl !== undefined) {
      course.thumbnailUrl = input.thumbnailUrl;
    }
    if (input.previewVideoUrl !== undefined) {
      course.previewVideoUrl = input.previewVideoUrl;
    }

    if (input.pricing !== undefined) {
      course.pricing.amount = input.pricing.amount;
      if (input.pricing.currency !== undefined) {
        course.pricing.currency = input.pricing.currency;
      }
      if (input.pricing.discountPercent !== undefined) {
        course.pricing.discountPercent = input.pricing.discountPercent;
      }
    }

    if (input.isPublished !== undefined) {
      course.isPublished = input.isPublished;
      course.publishedAt = input.isPublished ? new Date() : null;
    }

    await course.save();

    return { courseId: course._id.toString() };
  }

  async addModule(
    mentorId: string,
    courseId: string,
    input: AddModuleInput,
  ) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new AppError(400, "Invalid course id");
    }
    const course = await Course.findById(courseId);
    assertOwnCourse(mentorId, course);

    const orders = course.modules.map((m) => m.order);
    const maxOrder = orders.length ? Math.max(...orders) : -1;
    const order =
      input.order !== undefined ? input.order : Math.max(0, maxOrder + 1);

    course.modules.push({
      title: input.title,
      description: input.description ?? "",
      contentUrl: null,
      contentType: input.contentType,
      duration: input.duration ?? "",
      order,
      isFree: input.isFree ?? false,
    });

    await course.save();
    const last = course.modules.at(-1) as
      | { _id?: Types.ObjectId }
      | undefined;
    return { moduleId: last?._id?.toString() ?? "" };
  }

  async updateModule(
    mentorId: string,
    courseId: string,
    moduleId: string,
    input: UpdateModuleInput,
  ) {
    if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(moduleId)) {
      throw new AppError(400, "Invalid id");
    }
    const course = await Course.findById(courseId);
    assertOwnCourse(mentorId, course);
    const doc = course!;

    const sub = (
      doc.modules as unknown as {
        id: (id: string) => (typeof doc.modules)[number] | null;
      }
    ).id(moduleId);
    if (!sub) {
      throw new AppError(404, "Module not found");
    }

    if (input.title !== undefined) sub.title = input.title;
    if (input.description !== undefined) sub.description = input.description;
    if (input.contentType !== undefined) sub.contentType = input.contentType;
    if (input.duration !== undefined) sub.duration = input.duration;
    if (input.isFree !== undefined) sub.isFree = input.isFree;
    if (input.order !== undefined) sub.order = input.order;
    if (input.contentUrl !== undefined) {
      sub.contentUrl = input.contentUrl;
    }

    await doc.save();
    return { moduleId };
  }

  async setModuleContentUrlFromUpload(
    mentorId: string,
    courseId: string,
    moduleId: string,
    publicUrl: string,
  ) {
    return this.updateModule(mentorId, courseId, moduleId, {
      contentUrl: publicUrl,
    });
  }

  async listEnrolledStudents(mentorId: string, courseId: string) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new AppError(400, "Invalid course id");
    }
    const course = await Course.findById(courseId).select("mentorId title").lean();
    assertOwnCourse(mentorId, course);

    const rows = await Enrollment.find({
      courseId,
      mentorId,
      status: { $in: ["active", "completed"] },
    })
      .sort({ enrolledAt: -1 })
      .populate("studentId", "name email avatar")
      .lean();

    return {
      courseTitle: course.title,
      students: rows
        .map((e) => {
          const s = e.studentId as unknown as {
            _id?: Types.ObjectId;
            name?: string;
            email?: string;
            avatar?: string | null;
          } | null;
          if (!s?._id) return null;
          return {
            enrollmentId: e._id.toString(),
            studentId: s._id.toString(),
            name: s.name ?? "Student",
            email: s.email ?? "",
            avatar: s.avatar ?? null,
            progress: e.progress,
            status: e.status,
            enrolledAt: e.enrolledAt,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    };
  }
}

export const mentorCourseService = new MentorCourseService();
