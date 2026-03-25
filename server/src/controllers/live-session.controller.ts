import type { Request, Response } from "express";
import { liveSessionService } from "../services/live-session.service.js";
import { AppError } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { sessionQuerySchema } from "../validators/live-session.validator.js";

// ── CREATE SESSION ───────────────────────────────────
// POST /api/mentor/sessions
export const createSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const session = await liveSessionService.createSession(
      req.user.userId,
      req.body,
    );

    sendSuccess(res, 201, "Session scheduled successfully", { session });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Create session error:", error);
    sendError(res, 500, "Failed to schedule session");
  }
};

// ── GET ALL MENTOR SESSIONS ──────────────────────────
// GET /api/mentor/sessions?page=1&limit=10&type=all&status=all
export const getMentorSessions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    // Parse query params
    const queryResult = sessionQuerySchema.safeParse(req.query);
    const query = queryResult.success
      ? queryResult.data
      : { page: 1, limit: 10, type: "all" as const, status: "all" as const };

    const result = await liveSessionService.getMentorSessions(
      req.user.userId,
      query,
    );

    sendSuccess(res, 200, "Sessions fetched successfully", result);
  } catch (error) {
    console.error("Get sessions error:", error);
    sendError(res, 500, "Failed to fetch sessions");
  }
};

// ── GET SINGLE SESSION ───────────────────────────────
// GET /api/mentor/sessions/:id
export const getSessionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const rawSessionId = req.params["id"];
    const sessionId =
      typeof rawSessionId === "string" ? rawSessionId : rawSessionId?.[0];
    if (!sessionId) {
      sendError(res, 400, "Session ID is required");
      return;
    }

    const session = await liveSessionService.getSessionById(
      sessionId,
      req.user.userId,
    );

    sendSuccess(res, 200, "Session fetched successfully", { session });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Get session error:", error);
    sendError(res, 500, "Failed to fetch session");
  }
};

// ── UPDATE SESSION ───────────────────────────────────
// PUT /api/mentor/sessions/:id
export const updateSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const rawSessionId = req.params["id"];
    const sessionId =
      typeof rawSessionId === "string" ? rawSessionId : rawSessionId?.[0];
    if (!sessionId) {
      sendError(res, 400, "Session ID is required");
      return;
    }

    const session = await liveSessionService.updateSession(
      sessionId,
      req.user.userId,
      req.body,
    );

    sendSuccess(res, 200, "Session updated successfully", { session });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Update session error:", error);
    sendError(res, 500, "Failed to update session");
  }
};

// ── COMPLETE SESSION ─────────────────────────────────
// PATCH /api/mentor/sessions/:id/complete
export const completeSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const rawSessionId = req.params["id"];
    const sessionId =
      typeof rawSessionId === "string" ? rawSessionId : rawSessionId?.[0];
    if (!sessionId) {
      sendError(res, 400, "Session ID is required");
      return;
    }

    const session = await liveSessionService.completeSession(
      sessionId,
      req.user.userId,
    );

    sendSuccess(res, 200, "Session marked as completed", { session });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Complete session error:", error);
    sendError(res, 500, "Failed to complete session");
  }
};

// ── DELETE SESSION ───────────────────────────────────
// DELETE /api/mentor/sessions/:id
export const deleteSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const rawSessionId = req.params["id"];
    const sessionId =
      typeof rawSessionId === "string" ? rawSessionId : rawSessionId?.[0];
    if (!sessionId) {
      sendError(res, 400, "Session ID is required");
      return;
    }

    await liveSessionService.deleteSession(sessionId, req.user.userId);

    sendSuccess(res, 200, "Session deleted successfully");
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Delete session error:", error);
    sendError(res, 500, "Failed to delete session");
  }
};

// ── JOIN SESSION (Student) ───────────────────────────
// POST /api/sessions/:id/join
export const joinSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const rawSessionId = req.params["id"];
    const sessionId =
      typeof rawSessionId === "string" ? rawSessionId : rawSessionId?.[0];
    if (!sessionId) {
      sendError(res, 400, "Session ID is required");
      return;
    }

    const { accessCode } = req.body as { accessCode?: string };

    const result = await liveSessionService.joinSession(
      sessionId,
      req.user.userId,
      accessCode,
    );

    sendSuccess(res, 200, "Joined session successfully", result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Join session error:", error);
    sendError(res, 500, "Failed to join session");
  }
};
