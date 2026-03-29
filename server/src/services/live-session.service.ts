import crypto from "crypto";
import {
  LiveSession,
  type ILiveSession,
} from "../models/live-session.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Course, type ICourse } from "../models/course.js";
import { User } from "../models/user.model.js";
import { notificationService } from "./notification.service.js";
import { AppError } from "./auth.service.js";
import type {
  CreateSessionInput,
  UpdateSessionInput,
  AvailableSessionsQueryInput,
} from "../validators/live-session.validator.js";

// ── Types ────────────────────────────────────────────

interface SessionsQuery {
  page: number;
  limit: number;
  type: "free_demo" | "paid_class" | "all";
  status: "upcoming" | "completed" | "all";
}

interface PaginatedResult {
  sessions: ILiveSession[];
  total: number;
  page: number;
  totalPages: number;
}

// ── Service Class ────────────────────────────────────

class LiveSessionService {
  /**
   * Schedule a new live session
   */
  async createSession(
    mentorId: string,
    input: CreateSessionInput,
  ): Promise<ILiveSession> {
    // 1. If courseId provided, verify mentor owns the course
    if (input.courseId) {
      const course = await Course.findOne({
        _id: input.courseId,
        mentorId,
      });

      if (!course) {
        throw new AppError(
          404,
          "Course not found or you do not own this course",
        );
      }
    }

    // 2. Generate session link based on type
    const sessionCode = this.generateSessionCode();
    const link = this.generateSessionLink(sessionCode);

    // 3. Generate access code for paid classes
    let accessCode: string | null = null;
    if (input.type === "paid_class") {
      accessCode = this.generateAccessCode();
    }

    // 4. Create the session
    const session = await LiveSession.create({
      mentorId,
      courseId: input.courseId ?? null,
      topic: input.topic,
      description: input.description ?? "",
      date: input.date,
      time: input.time,
      type: input.type,
      link,
      accessCode,
      maxAttendees: input.maxAttendees ?? 100,
    });

    // 5. Notify relevant students
    await this.notifyStudentsAboutSession(session, mentorId);

    return session;
  }

  /**
   * Get all sessions for a mentor
   */
  async getMentorSessions(
    mentorId: string,
    query: SessionsQuery,
  ): Promise<PaginatedResult> {
    const { page, limit, type, status } = query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = { mentorId };

    if (type !== "all") {
      filter["type"] = type;
    }

    if (status === "upcoming") {
      filter["isCompleted"] = false;
    } else if (status === "completed") {
      filter["isCompleted"] = true;
    }

    const [sessions, total] = await Promise.all([
      LiveSession.find(filter)
        .populate("courseId", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LiveSession.countDocuments(filter),
    ]);

    return {
      sessions: sessions as ILiveSession[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Upcoming / live sessions for the student catalog (browse & join).
   */
  async getAvailableSessionsForStudents(
    query: AvailableSessionsQueryInput,
  ): Promise<PaginatedResult> {
    const { page, limit, type } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      isCompleted: false,
      status: { $in: ["scheduled", "live"] },
    };

    if (type !== "all") {
      filter["type"] = type;
    }

    const [sessions, total] = await Promise.all([
      LiveSession.find(filter)
        .populate("courseId", "title")
        .sort({ scheduledAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      LiveSession.countDocuments(filter),
    ]);

    return {
      sessions: sessions as ILiveSession[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single session by ID
   */
  async getSessionById(
    sessionId: string,
    mentorId: string,
  ): Promise<ILiveSession> {
    const session = await LiveSession.findOne({
      _id: sessionId,
      mentorId,
    })
      .populate("courseId", "title")
      .lean();

    if (!session) {
      throw new AppError(404, "Session not found");
    }

    return session as ILiveSession;
  }

  /**
   * Update a session
   */
  async updateSession(
    sessionId: string,
    mentorId: string,
    input: UpdateSessionInput,
  ): Promise<ILiveSession> {
    const session = await LiveSession.findOne({
      _id: sessionId,
      mentorId,
    });

    if (!session) {
      throw new AppError(404, "Session not found");
    }

    if (session.isCompleted) {
      throw new AppError(400, "Cannot update a completed session");
    }

    // Update fields
    if (input.topic !== undefined) session.topic = input.topic;
    if (input.date !== undefined) session.date = input.date;
    if (input.time !== undefined) session.time = input.time;
    if (input.description !== undefined)
      session.description = input.description;
    if (input.maxAttendees !== undefined)
      session.maxAttendees = input.maxAttendees;

    // Handle type change
    if (input.type !== undefined && input.type !== session.type) {
      session.type = input.type;

      if (input.type === "paid_class" && !session.accessCode) {
        session.accessCode = this.generateAccessCode();
      } else if (input.type === "free_demo") {
        session.accessCode = null;
      }
    }

    // Handle completion
    if (input.isCompleted !== undefined) {
      session.isCompleted = input.isCompleted;
    }

    await session.save();

    return session.toJSON() as ILiveSession;
  }

  /**
   * Mark a session as completed
   */
  async completeSession(
    sessionId: string,
    mentorId: string,
  ): Promise<ILiveSession> {
    const session = await LiveSession.findOne({
      _id: sessionId,
      mentorId,
    });

    if (!session) {
      throw new AppError(404, "Session not found");
    }

    if (session.isCompleted) {
      throw new AppError(400, "Session is already completed");
    }

    session.isCompleted = true;
    await session.save();

    return session.toJSON() as ILiveSession;
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string, mentorId: string): Promise<void> {
    const session = await LiveSession.findOne({
      _id: sessionId,
      mentorId,
    });

    if (!session) {
      throw new AppError(404, "Session not found");
    }

    if (session.isCompleted) {
      throw new AppError(400, "Cannot delete a completed session");
    }

    await session.deleteOne();
  }

  /**
   * Get upcoming sessions count for mentor dashboard stats
   */
  async getUpcomingCount(mentorId: string): Promise<number> {
    return LiveSession.countDocuments({
      mentorId,
      isCompleted: false,
    });
  }

  /**
   * Join a session — validate access for paid classes
   */
  async joinSession(
    sessionId: string,
    studentId: string,
    accessCode?: string,
  ): Promise<{ link: string }> {
    const session = await LiveSession.findById(sessionId);

    if (!session) {
      throw new AppError(404, "Session not found");
    }

    if (session.isCompleted) {
      throw new AppError(400, "This session has already ended");
    }

    if (session.attendeeCount >= session.maxAttendees) {
      throw new AppError(400, "Session is full");
    }

    // For paid classes, verify access
    if (session.type === "paid_class") {
      // Check if student provided correct access code
      if (accessCode && accessCode === session.accessCode) {
        // Access granted via code
      }
      // Or check if student is enrolled in the course
      else if (session.courseId) {
        const enrollment = await Enrollment.findOne({
          studentId,
          courseId: session.courseId,
        });

        if (!enrollment) {
          throw new AppError(
            403,
            "You must be enrolled in the course or have an access code to join this session",
          );
        }
      } else {
        throw new AppError(403, "Invalid access code");
      }
    }

    // Increment attendee count
    session.attendeeCount += 1;
    await session.save();

    if (!session.link) {
      throw new AppError(500, "Session link not generated");
    }

    return { link: session.link };
  }

  // ── Private Helpers ──────────────────────────────────

  /**
   * Generate a unique session code
   */
  private generateSessionCode(): string {
    return crypto.randomBytes(6).toString("hex");
  }

  /**
   * Generate a session meeting link
   * In production, integrate with Zoom/Google Meet/Jitsi API
   */
  private generateSessionLink(code: string): string {
    // TODO: Replace with actual meeting platform integration
    // For now, generate a placeholder link
    return `https://meet.internportal.com/session/${code}`;
  }

  /**
   * Generate a private access code for paid sessions
   */
  private generateAccessCode(): string {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
  }

  /**
   * Notify relevant students about a new session
   */
  private async notifyStudentsAboutSession(
    session: ILiveSession,
    mentorId: string,
  ): Promise<void> {
    try {
      // Get mentor name
      const mentor = await User.findById(mentorId).select("name");
      const mentorName = mentor?.name ?? "Your Mentor";

      let studentIds: string[] = [];

      if (session.courseId) {
        // Notify enrolled students of the course
        const enrollments = await Enrollment.find({
          courseId: session.courseId,
        }).select("studentId");

        studentIds = enrollments.map((e) => e.studentId.toString());
      } else {
        // Notify all students of this mentor
        // Find students who are enrolled in any of this mentor's courses
        const mentorCourses = await Course.find({ mentorId })
          .select("_id")
          .lean<Array<Pick<ICourse, "_id">>>();
        const courseIds = mentorCourses.map((c: Pick<ICourse, "_id">) => c._id);

        const enrollments = await Enrollment.find({
          courseId: { $in: courseIds },
        }).select("studentId");

        // Deduplicate student IDs
        studentIds = [
          ...new Set(enrollments.map((e) => e.studentId.toString())),
        ];
      }

      if (studentIds.length === 0) return;

      // Build notification message
      const typeLabel =
        session.type === "free_demo" ? "Free Demo" : "Live Class";
      const message = `📅 ${mentorName} scheduled a ${typeLabel}: "${session.topic}" on ${session.date} at ${session.time}`;

      await notificationService.createBulk({
        userIds: studentIds,
        title: "New Live Session Scheduled",
        message,
        type: "session_scheduled",
        link: `/student/sessions/${session._id.toString()}`,
      });
    } catch (error) {
      // Don't fail session creation if notification fails
      console.error("Failed to send session notifications:", error);
    }
  }
}

// ── Export Singleton ──────────────────────────────────
export const liveSessionService = new LiveSessionService();
