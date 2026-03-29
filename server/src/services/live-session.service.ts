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
  private async ensureDemoSessionsForStudents(): Promise<void> {
    const existingCount = await LiveSession.countDocuments({
      status: { $in: ["scheduled", "live"] },
      isCompleted: false,
      topic: { $regex: "^Demo:", $options: "i" },
    });

    if (existingCount >= 6) {
      return;
    }

    let mentorId = (await User.findOne({ role: "mentor" }).select("_id"))?._id;

    if (!mentorId) {
      const createdMentor = await User.create({
        name: "Demo Mentor",
        email: "demo.mentor@internportal.dev",
        role: "mentor",
        password: null,
        provider: "local",
      });
      mentorId = createdMentor._id;
    }

    const today = new Date();
    const addDays = (days: number): string => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };

    const demoSessions: Array<{
      topic: string;
      description: string;
      date: string;
      time: string;
      type: "free_demo" | "paid_class";
      maxAttendees: number;
      attendeeCount: number;
      duration: number;
      accessCode?: string;
    }> = [
      {
        topic: "Demo: DSA Arrays and Strings",
        description: "High-impact DSA fundamentals with guided problem solving.",
        date: addDays(1),
        time: "18:00",
        type: "free_demo",
        maxAttendees: 100,
        attendeeCount: 32,
        duration: 75,
      },
      {
        topic: "Demo: Full Stack Project Architecture",
        description: "Designing scalable MERN projects from idea to deployment.",
        date: addDays(2),
        time: "20:00",
        type: "paid_class",
        maxAttendees: 80,
        attendeeCount: 24,
        duration: 90,
        accessCode: "FS2026",
      },
      {
        topic: "Demo: AI/ML Roadmap and Model Basics",
        description: "From Python basics to deploying your first ML model.",
        date: addDays(3),
        time: "17:30",
        type: "free_demo",
        maxAttendees: 120,
        attendeeCount: 56,
        duration: 80,
      },
      {
        topic: "Demo: Resume and Interview Masterclass",
        description: "Craft interview-ready profiles and answer strategies.",
        date: addDays(4),
        time: "19:00",
        type: "free_demo",
        maxAttendees: 150,
        attendeeCount: 78,
        duration: 60,
      },
      {
        topic: "Demo: SQL for Placements",
        description: "Top SQL patterns asked in internship and placement rounds.",
        date: addDays(5),
        time: "18:30",
        type: "paid_class",
        maxAttendees: 90,
        attendeeCount: 40,
        duration: 70,
        accessCode: "SQL2026",
      },
      {
        topic: "Demo: System Design Essentials",
        description: "Build intuition for scalable systems with simple frameworks.",
        date: addDays(6),
        time: "21:00",
        type: "free_demo",
        maxAttendees: 110,
        attendeeCount: 45,
        duration: 85,
      },
    ];

    for (const session of demoSessions) {
      const alreadyExists = await LiveSession.findOne({
        topic: session.topic,
        date: session.date,
      })
        .select("_id")
        .lean();

      if (alreadyExists) continue;

      await LiveSession.create({
        mentorId,
        courseId: null,
        topic: session.topic,
        description: session.description,
        date: session.date,
        time: session.time,
        type: session.type,
        duration: session.duration,
        link: `https://meet.internportal.com/demo/${session.topic
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`,
        accessCode: session.type === "paid_class" ? session.accessCode ?? "DEMO" : null,
        maxAttendees: session.maxAttendees,
        attendeeCount: session.attendeeCount,
        status: "scheduled",
        isCompleted: false,
      });
    }
  }

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
    await this.ensureDemoSessionsForStudents();

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
