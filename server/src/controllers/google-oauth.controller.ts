import type { Request, Response } from "express";
import {
  ArcticFetchError,
  OAuth2RequestError,
  UnexpectedResponseError,
} from "arctic";
import { googleOAuthService } from "../services/google-oauth.service.js";
import { AppError } from "../services/auth.service.js";
import { sendError } from "../utils/response.utils.js";
import { ENV } from "../config/env.js";

const redirectLoginError = (res: Response, message: string): void => {
  res.redirect(
    `${ENV.CLIENT_URL}/login?error=${encodeURIComponent(message.slice(0, 400))}`,
  );
};

const isMongoUnavailableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "MongoServerSelectionError" ||
    error.name === "MongoNotConnectedError" ||
    error.message.includes("buffering timed out") ||
    error.message.includes("not connected to MongoDB")
  );
};

const oauth2UserMessage = (err: OAuth2RequestError): string => {
  const code = err.code;
  const fromGoogle = err.description?.trim();
  if (fromGoogle) return fromGoogle;
  if (code === "redirect_uri_mismatch") {
    return `Google redirect URI mismatch. In Google Cloud Console → Credentials → your OAuth client, add this exact Authorized redirect URI: ${ENV.GOOGLE_REDIRECT_URI}`;
  }
  if (code === "invalid_client") {
    return "Google rejected the client credentials. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server .env.";
  }
  if (code === "invalid_grant") {
    return "Sign-in expired or the code was already used. Please try Continue with Google again.";
  }
  return err.message || "Google token exchange failed.";
};

// ── Cookie Options (reuse from auth controller) ──────
const isProd = ENV.NODE_ENV === "production";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

// OAuth state cookie options (short-lived)
const OAUTH_STATE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/",
  maxAge: 10 * 60 * 1000, // 10 minutes
};

// ── INITIATE GOOGLE OAUTH ────────────────────────────
// GET /api/auth/google
// Query params: ?role=student|mentor|recruiter (optional, for new users)
export const initiateGoogleAuth = (req: Request, res: Response): void => {
  try {
    const role = req.query["role"] as string | undefined;

    // Validate role if provided
    const validRoles = ["student", "mentor", "recruiter"];
    if (role && !validRoles.includes(role)) {
      sendError(
        res,
        400,
        "Invalid role. Must be student, mentor, or recruiter.",
      );
      return;
    }

    // Generate authorization URL
    const { url, state, codeVerifier } =
      googleOAuthService.createAuthorizationURL();

    // Store state and codeVerifier in httpOnly cookies (for CSRF protection)
    res.cookie("google_oauth_state", state, OAUTH_STATE_COOKIE_OPTIONS);
    res.cookie(
      "google_oauth_code_verifier",
      codeVerifier,
      OAUTH_STATE_COOKIE_OPTIONS,
    );

    // Store role preference in cookie (for new user registration)
    if (role) {
      res.cookie("google_oauth_role", role, OAUTH_STATE_COOKIE_OPTIONS);
    }

    // Redirect to Google consent screen
    res.redirect(url);
  } catch (error) {
    console.error("Google OAuth initiate error:", error);
    if (error instanceof OAuth2RequestError) {
      redirectLoginError(res, oauth2UserMessage(error));
      return;
    }
    redirectLoginError(
      res,
      "Could not start Google sign-in. Check server logs and Google OAuth configuration.",
    );
  }
};

// ── GOOGLE OAUTH CALLBACK ────────────────────────────
// GET /api/auth/google/callback
// Google redirects here with ?code=...&state=...
export const googleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Extract query params
    const code = req.query["code"] as string | undefined;
    const state = req.query["state"] as string | undefined;
    const errorParam = req.query["error"] as string | undefined;

    // 2. Check for errors from Google
    if (errorParam) {
      console.error("Google OAuth error:", errorParam);
      res.redirect(`${ENV.CLIENT_URL}/login?error=google_denied`);
      return;
    }

    // 3. Validate code and state exist
    if (!code || !state) {
      res.redirect(`${ENV.CLIENT_URL}/login?error=missing_params`);
      return;
    }

    // 4. Retrieve stored state and code verifier from cookies
    const storedState = req.cookies?.["google_oauth_state"] as
      | string
      | undefined;
    const codeVerifier = req.cookies?.["google_oauth_code_verifier"] as
      | string
      | undefined;
    const role = req.cookies?.["google_oauth_role"] as string | undefined;

    // 5. Validate state (CSRF protection)
    if (!storedState || state !== storedState) {
      res.redirect(`${ENV.CLIENT_URL}/login?error=invalid_state`);
      return;
    }

    // 6. Validate code verifier exists
    if (!codeVerifier) {
      res.redirect(`${ENV.CLIENT_URL}/login?error=missing_verifier`);
      return;
    }

    // 7. Clear OAuth cookies
    res.clearCookie("google_oauth_state", { path: "/" });
    res.clearCookie("google_oauth_code_verifier", { path: "/" });
    res.clearCookie("google_oauth_role", { path: "/" });

    // 8. Get session meta
    const meta = {
      ip: req.clientIp ?? req.ip ?? null,
      userAgent: req.headers["user-agent"] ?? null,
    };

    // 9. Handle the callback — exchange code for tokens & create/find user
    const validRole = (["student", "mentor", "recruiter"] as const).find(
      (r) => r === role,
    );
    const result = await googleOAuthService.handleCallback(
      code,
      codeVerifier,
      validRole ?? null,
      meta,
    );

    // 10. Set auth cookies
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

    // 11. Redirect to frontend with success
    const redirectPath = getRedirectByRole(result.user.role);
    const params = new URLSearchParams({
      token: result.tokens.accessToken,
      isNewUser: result.isNewUser.toString(),
    });

    res.redirect(`${ENV.CLIENT_URL}${redirectPath}?${params.toString()}`);
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    if (error instanceof AppError) {
      redirectLoginError(res, error.message);
      return;
    }

    if (error instanceof OAuth2RequestError) {
      redirectLoginError(res, oauth2UserMessage(error));
      return;
    }

    if (error instanceof ArcticFetchError) {
      redirectLoginError(
        res,
        "Could not reach Google (network error). Check your connection and try again.",
      );
      return;
    }

    if (error instanceof UnexpectedResponseError) {
      redirectLoginError(
        res,
        `Google returned an unexpected response (HTTP ${error.status}). Try again later.`,
      );
      return;
    }

    if (isMongoUnavailableError(error)) {
      redirectLoginError(
        res,
        "Database is not connected. Start MongoDB, confirm MONGODB_URI in server .env, then try Google sign-in again.",
      );
      return;
    }

    redirectLoginError(
      res,
      "Google sign-in failed for an unexpected reason. See the API server console log for details.",
    );
  }
};

// ── Helper: Get redirect path by role ────────────────
const getRedirectByRole = (role: string): string => {
  switch (role) {
    case "student":
      return "/student";
    case "mentor":
      return "/mentor";
    case "recruiter":
      return "/recruiter";
    default:
      return "/student";
  }
};
