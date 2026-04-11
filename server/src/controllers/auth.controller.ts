import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { authService, AppError } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";

// ── Cookie Options ───────────────────────────────────
// Production: SameSite=None + Secure so cookies are sent on cross-origin
// requests (e.g. Vercel UI → Render API). Local dev stays Lax over HTTP.
const isProd = ENV.NODE_ENV === "production";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
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

const tryDeleteLocalAvatar = (avatarUrlOrPath: string | null): void => {
  try {
    if (!avatarUrlOrPath) return;
    if (!avatarUrlOrPath.startsWith("/uploads/avatars/")) return;

    const relative = avatarUrlOrPath.replace(/^\/uploads\/avatars\//, "");
    if (!relative || relative.includes("..") || path.isAbsolute(relative)) return;

    const filePath = path.join(process.cwd(), "uploads", "avatars", relative);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // best-effort cleanup
  }
};

// ── UPLOAD / REPLACE AVATAR ───────────────────────────
export const uploadMyAvatar = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const file = req.file;
    if (!file) {
      sendError(res, 400, "Avatar file is required (field name: avatar)");
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    // delete previous local avatar if any (best effort)
    tryDeleteLocalAvatar(user.avatar ?? null);

    const avatarPath = `/uploads/avatars/${file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    sendSuccess(res, 200, "Avatar updated successfully", {
      avatar: avatarPath,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, "Internal server error");
  }
};

// ── GET MY AVATAR (redirect to static URL) ────────────
export const getMyAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Authentication required");
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    if (!user.avatar) {
      sendError(res, 404, "Avatar not set");
      return;
    }

    res.redirect(302, user.avatar);
  } catch (error) {
    console.error("Get avatar error:", error);
    sendError(res, 500, "Internal server error");
  }
};
