import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils.js";
import { sendError } from "../utils/response.utils.js";

/**
 * Middleware to verify JWT access token.
 * Allows users with null role (they just can't pass authorize).
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // 2. Fallback to cookie
    if (!token) {
      token = req.cookies?.["accessToken"] as string | undefined;
    }

    if (!token) {
      sendError(res, 401, "Access token is required. Please log in.");
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role, // Can be null for OAuth users without role
    };

    next();
  } catch (_error) {
    sendError(res, 401, "Invalid or expired access token");
  }
};

/**
 * Middleware to restrict access to specific roles.
 * Users with null role will always be rejected.
 */
export const authorize = (
  ...roles: Array<"student" | "mentor" | "recruiter">
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    // Null role means user hasn't selected a role yet
    if (!req.user.role) {
      sendError(
        res,
        403,
        "Please select a role before accessing this resource",
      );
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        403,
        `Access denied. Required role: ${roles.join(" or ")}`,
      );
      return;
    }

    next();
  };
};
