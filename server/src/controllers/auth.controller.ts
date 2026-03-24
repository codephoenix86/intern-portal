import type { Request, Response } from "express";
import { authService, AppError } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { ENV } from "../config/env.js";

// ── Cookie Options ───────────────────────────────────
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite:
    ENV.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite:
    ENV.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
  path: "/",
  maxAge: 15 * 60 * 1000, // 15 min in ms
};

// ── Helper ───────────────────────────────────────────
const getSessionMeta = (req: Request) => ({
  ip: req.clientIp ?? req.ip ?? null,
  userAgent: req.headers["user-agent"] ?? null,
});

// ── REGISTER ─────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const meta = getSessionMeta(req);
    const result = await authService.register(req.body, meta);

    // Set cookies
    res.cookie(
      "accessToken",
      result.tokens.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );
    res.cookie(
      "refreshToken",
      result.tokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    sendSuccess(res, 201, "Account created successfully", {
      user: result.user,
      accessToken: result.tokens.accessToken,
      // refreshToken intentionally NOT in response body — only in httpOnly cookie
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Register error:", error);
    sendError(res, 500, "Internal server error");
  }
};

// ── LOGIN ────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const meta = getSessionMeta(req);
    const result = await authService.login(email, password, meta);

    // Set cookies
    res.cookie(
      "accessToken",
      result.tokens.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );
    res.cookie(
      "refreshToken",
      result.tokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    sendSuccess(res, 200, "Login successful", {
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Login error:", error);
    sendError(res, 500, "Internal server error");
  }
};

// ── REFRESH TOKEN ────────────────────────────────────
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get refresh token from cookie OR body
    const token: string | undefined =
      req.cookies?.["refreshToken"] ?? req.body?.refreshToken;

    if (!token) {
      sendError(res, 401, "Refresh token is required");
      return;
    }

    const meta = getSessionMeta(req);
    const tokens = await authService.refreshAccessToken(token, meta);

    // Set new cookies
    res.cookie("accessToken", tokens.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie(
      "refreshToken",
      tokens.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    sendSuccess(res, 200, "Token refreshed successfully", {
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    if (error instanceof AppError) {
      // Clear invalid cookies
      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/api/auth" });
      sendError(res, error.statusCode, error.message);
      return;
    }
    console.error("Refresh token error:", error);
    sendError(res, 500, "Internal server error");
  }
};

// ── LOGOUT ───────────────────────────────────────────
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token: string | undefined = req.cookies?.["refreshToken"];

    if (token) {
      await authService.logout(token);
    }

    // Clear cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/api/auth" });

    sendSuccess(res, 200, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies even if DB operation fails
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/api/auth" });
    sendSuccess(res, 200, "Logged out successfully");
  }
};

// ── LOGOUT ALL DEVICES ───────────────────────────────
export const logoutAll = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    await authService.logoutAll(req.user.userId);

    // Clear cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/api/auth" });

    sendSuccess(res, 200, "Logged out from all devices successfully");
  } catch (error) {
    console.error("Logout all error:", error);
    sendError(res, 500, "Internal server error");
  }
};

// ── GET CURRENT USER ─────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);

    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    sendSuccess(res, 200, "User fetched successfully", { user });
  } catch (error) {
    console.error("Get me error:", error);
    sendError(res, 500, "Internal server error");
  }
};
