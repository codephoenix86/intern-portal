import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response.utils.js";
import { connectionService } from "../services/connection.service.js";
import { AppError } from "../services/auth.service.js";
import {
  sendFriendRequestSchema,
  respondFriendRequestSchema,
  followUserSchema,
  unfollowUserSchema,
  removeFriendSchema,
  connectionListQuerySchema,
} from "../validators/connection.validator.js";

// ── Friend Requests ──

export const sendFriendRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = sendFriendRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const data = await connectionService.sendFriendRequest(
      req.user!.userId,
      parsed.data.toUserId,
    );
    sendSuccess(res, 201, data.message, data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Send friend request error:", error);
    sendError(res, 500, "Failed to send friend request");
  }
};

export const respondFriendRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = respondFriendRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const data = await connectionService.respondToFriendRequest(
      req.user!.userId,
      parsed.data.connectionId,
      parsed.data.action,
    );
    sendSuccess(res, 200, data.message, data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Respond friend request error:", error);
    sendError(res, 500, "Failed to respond to friend request");
  }
};

export const removeFriend = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = removeFriendSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const data = await connectionService.removeFriend(
      req.user!.userId,
      parsed.data.toUserId,
    );
    sendSuccess(res, 200, data.message, data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Remove friend error:", error);
    sendError(res, 500, "Failed to remove friend");
  }
};

export const cancelFriendRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = removeFriendSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const data = await connectionService.cancelFriendRequest(
      req.user!.userId,
      parsed.data.toUserId,
    );
    sendSuccess(res, 200, data.message, data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Cancel friend request error:", error);
    sendError(res, 500, "Failed to cancel friend request");
  }
};

// ── Follow ──

export const followUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = followUserSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const data = await connectionService.followUser(
      req.user!.userId,
      parsed.data.toUserId,
    );
    sendSuccess(res, 201, data.message, data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Follow user error:", error);
    sendError(res, 500, "Failed to follow user");
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = unfollowUserSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "Invalid body", parsed.error.flatten().fieldErrors);
      return;
    }
    const data = await connectionService.unfollowUser(
      req.user!.userId,
      parsed.data.toUserId,
    );
    sendSuccess(res, 200, data.message, data);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Unfollow user error:", error);
    sendError(res, 500, "Failed to unfollow user");
  }
};

// ── Lists ──

export const listFriends = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = connectionListQuerySchema.safeParse(req.query);
    const raw = parsed.success ? parsed.data : { page: 1, limit: 20 };
    const data = await connectionService.listFriends(req.user!.userId, {
      page: raw.page,
      limit: raw.limit,
      q: raw.q,
    });
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("List friends error:", error);
    sendError(res, 500, "Failed to list friends");
  }
};

export const listPendingRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = connectionListQuerySchema.safeParse(req.query);
    const raw = parsed.success ? parsed.data : { page: 1, limit: 20 };
    const data = await connectionService.listPendingRequests(req.user!.userId, {
      page: raw.page,
      limit: raw.limit,
    });
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("List pending requests error:", error);
    sendError(res, 500, "Failed to list pending requests");
  }
};

export const listFollowingRecruiters = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = connectionListQuerySchema.safeParse(req.query);
    const raw = parsed.success ? parsed.data : { page: 1, limit: 20 };
    const data = await connectionService.listFollowingRecruiters(
      req.user!.userId,
      { page: raw.page, limit: raw.limit, q: raw.q },
    );
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("List following recruiters error:", error);
    sendError(res, 500, "Failed to list following recruiters");
  }
};

export const listFollowingMentors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = connectionListQuerySchema.safeParse(req.query);
    const raw = parsed.success ? parsed.data : { page: 1, limit: 20 };
    const data = await connectionService.listFollowingMentors(
      req.user!.userId,
      { page: raw.page, limit: raw.limit, q: raw.q },
    );
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("List following mentors error:", error);
    sendError(res, 500, "Failed to list following mentors");
  }
};

// ── Bulk Status ──

export const getBulkFriendStatuses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const ids = req.query["ids"];
    if (!ids || typeof ids !== "string") {
      sendError(res, 400, "ids query param required (comma-separated)");
      return;
    }
    const userIds = ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const data = await connectionService.getBulkFriendStatuses(
      req.user!.userId,
      userIds,
    );
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("Bulk friend statuses error:", error);
    sendError(res, 500, "Failed to get statuses");
  }
};

export const getBulkFollowStatuses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const ids = req.query["ids"];
    if (!ids || typeof ids !== "string") {
      sendError(res, 400, "ids query param required (comma-separated)");
      return;
    }
    const userIds = ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const data = await connectionService.getBulkFollowStatuses(
      req.user!.userId,
      userIds,
    );
    sendSuccess(res, 200, "OK", data);
  } catch (error) {
    console.error("Bulk follow statuses error:", error);
    sendError(res, 500, "Failed to get statuses");
  }
};
