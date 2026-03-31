import { type ILiveSession } from "../models/live-session.model.js";
import type { CreateSessionInput, UpdateSessionInput, AvailableSessionsQueryInput } from "../validators/live-session.validator.js";
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
declare class LiveSessionService {
    private ensureDemoSessionsForStudents;
    /**
     * Schedule a new live session
     */
    createSession(mentorId: string, input: CreateSessionInput): Promise<ILiveSession>;
    /**
     * Get all sessions for a mentor
     */
    getMentorSessions(mentorId: string, query: SessionsQuery): Promise<PaginatedResult>;
    /**
     * Upcoming / live sessions for the student catalog (browse & join).
     */
    getAvailableSessionsForStudents(query: AvailableSessionsQueryInput): Promise<PaginatedResult>;
    /**
     * Get a single session by ID
     */
    getSessionById(sessionId: string, mentorId: string): Promise<ILiveSession>;
    /**
     * Update a session
     */
    updateSession(sessionId: string, mentorId: string, input: UpdateSessionInput): Promise<ILiveSession>;
    /**
     * Mark a session as completed
     */
    completeSession(sessionId: string, mentorId: string): Promise<ILiveSession>;
    /**
     * Delete a session
     */
    deleteSession(sessionId: string, mentorId: string): Promise<void>;
    /**
     * Get upcoming sessions count for mentor dashboard stats
     */
    getUpcomingCount(mentorId: string): Promise<number>;
    /**
     * Join a session — validate access for paid classes
     */
    joinSession(sessionId: string, studentId: string, accessCode?: string): Promise<{
        link: string;
    }>;
    /**
     * Generate a unique session code
     */
    private generateSessionCode;
    /**
     * Generate a session meeting link
     * In production, integrate with Zoom/Google Meet/Jitsi API
     */
    private generateSessionLink;
    /**
     * Generate a private access code for paid sessions
     */
    private generateAccessCode;
    /**
     * Notify relevant students about a new session
     */
    private notifyStudentsAboutSession;
}
export declare const liveSessionService: LiveSessionService;
export {};
//# sourceMappingURL=live-session.service.d.ts.map