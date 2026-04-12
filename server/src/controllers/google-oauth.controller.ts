import type { Request, Response } from "express";
import { googleOAuthService } from "../services/google-oauth.service.js";
import { AppError } from "../services/auth.service.js";
import { sendError } from "../utils/response.utils.js";
import { ENV } from "../config/env.js";

// ── Cookie Options ───────────────────────────────────
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite:
    ENV.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite:
    ENV.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
  path: "/",
  maxAge: 15 * 60 * 1000,
};

const OAUTH_STATE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 10 * 60 * 1000,
};

// ── INITIATE GOOGLE OAUTH ────────────────────────────
export const initiateGoogleAuth = (req: Request, res: Response): void => {
  try {
    const role = req.query["role"] as string | undefined;

    const validRoles = ["student", "mentor", "recruiter"];
    if (role && !validRoles.includes(role)) {
      sendError(
        res,
        400,
        "Invalid role. Must be student, mentor, or recruiter.",
      );
      return;
    }

    const { url, state, codeVerifier } =
      googleOAuthService.createAuthorizationURL();

    res.cookie("google_oauth_state", state, OAUTH_STATE_COOKIE_OPTIONS);
    res.cookie(
      "google_oauth_code_verifier",
      codeVerifier,
      OAUTH_STATE_COOKIE_OPTIONS,
    );

    if (role) {
      res.cookie("google_oauth_role", role, OAUTH_STATE_COOKIE_OPTIONS);
    }

    res.redirect(url);
  } catch (error) {
    console.error("Google OAuth initiate error:", error);
    res.redirect(`${ENV.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// ── GOOGLE OAUTH CALLBACK ────────────────────────────
export const googleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const code = req.query["code"] as string | undefined;
    const state = req.query["state"] as string | undefined;
    const errorParam = req.query["error"] as string | undefined;

    if (errorParam) {
      console.error("Google OAuth error:", errorParam);
      res.redirect(`${ENV.CLIENT_URL}/login?error=google_denied`);
      return;
    }

    if (!code || !state) {
      res.redirect(`${ENV.CLIENT_URL}/login?error=missing_params`);
      return;
    }

    const storedState = req.cookies?.["google_oauth_state"] as
      | string
      | undefined;
    const codeVerifier = req.cookies?.["google_oauth_code_verifier"] as
      | string
      | undefined;
    const role = req.cookies?.["google_oauth_role"] as string | undefined;

    if (!storedState || state !== storedState) {
      res.redirect(`${ENV.CLIENT_URL}/login?error=invalid_state`);
      return;
    }

    if (!codeVerifier) {
      res.redirect(`${ENV.CLIENT_URL}/login?error=missing_verifier`);
      return;
    }

    // Clear OAuth cookies
    res.clearCookie("google_oauth_state", { path: "/" });
    res.clearCookie("google_oauth_code_verifier", { path: "/" });
    res.clearCookie("google_oauth_role", { path: "/" });

    const meta = {
      ip: req.clientIp ?? req.ip ?? null,
      userAgent: req.headers["user-agent"] ?? null,
    };

    const validRole = (["student", "mentor", "recruiter"] as const).find(
      (r) => r === role,
    );
    const result = await googleOAuthService.handleCallback(
      code,
      codeVerifier,
      validRole ?? null,
      meta,
    );

    // Set auth cookies
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

    // ── CHANGED: Redirect based on role ──
    // If user has no role, redirect to role selection page
    const redirectPath = getRedirectByRole(result.user.role);
    const params = new URLSearchParams({
      token: result.tokens.accessToken,
      isNewUser: result.isNewUser.toString(),
    });

    res.redirect(`${ENV.CLIENT_URL}${redirectPath}?${params.toString()}`);
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    if (error instanceof AppError) {
      const encodedMessage = encodeURIComponent(error.message);
      res.redirect(`${ENV.CLIENT_URL}/login?error=${encodedMessage}`);
      return;
    }

    res.redirect(`${ENV.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// ── CHANGED: Handle null role ────────────────────────
const getRedirectByRole = (role: string | null): string => {
  switch (role) {
    case "student":
      return "/student";
    case "mentor":
      return "/mentor";
    case "recruiter":
      return "/recruiter";
    default:
      return "/select-role"; // ← NEW: null role goes to role selection
  }
};
