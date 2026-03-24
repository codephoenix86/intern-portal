import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuth } from "../config/oauth.js";
import { User, type IUser } from "../models/user.model.js";
import { authService, AppError, type TokenPair } from "./auth.service.js";

// ── Types ────────────────────────────────────────────

interface GoogleUserInfo {
  sub: string; // Google user ID
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

interface OAuthResult {
  user: IUser;
  tokens: TokenPair;
  isNewUser: boolean;
}

interface SessionMeta {
  ip: string | null;
  userAgent: string | null;
}

// ── Service Class ────────────────────────────────────

class GoogleOAuthService {
  /**
   * Step 1: Generate authorization URL
   * Returns URL + state + codeVerifier to store in cookie
   */
  createAuthorizationURL(): {
    url: string;
    state: string;
    codeVerifier: string;
  } {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = googleOAuth.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "profile",
      "email",
    ]);

    return {
      url: url.toString(),
      state,
      codeVerifier,
    };
  }

  /**
   * Step 2: Exchange authorization code for tokens
   * and fetch Google user profile
   */
  async handleCallback(
    code: string,
    codeVerifier: string,
    role: IUser["role"] | null,
    meta: SessionMeta,
  ): Promise<OAuthResult> {
    // 1. Exchange code for Google tokens
    const tokens = await googleOAuth.validateAuthorizationCode(
      code,
      codeVerifier,
    );
    const accessToken = tokens.accessToken();

    // 2. Fetch Google user info
    const googleUser = await this.fetchGoogleUser(accessToken);

    // 3. Validate email
    if (!googleUser.email_verified) {
      throw new AppError(400, "Google email is not verified");
    }

    // 4. Find or create user
    let user = await User.findOne({ email: googleUser.email });
    let isNewUser = false;

    if (user) {
      // ── Existing User ──────────────────────────────
      // Update provider info if they haven't linked Google yet
      if (user.provider === "local") {
        user.provider = "google";
        user.providerId = googleUser.sub;
      }

      // Update avatar if not set
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }

      // Update last login
      user.lastLoginAt = new Date();
      user.lastLoginIp = meta.ip;
      await user.save();
    } else {
      // ── New User ───────────────────────────────────
      // Role must be provided for new OAuth users
      const userRole = role ?? "student"; // Default to student if no role specified

      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: null, // OAuth users have no password
        role: userRole,
        avatar: googleUser.picture ?? null,
        provider: "google",
        providerId: googleUser.sub,
        isVerified: true, // Google email is verified
        isActive: true,
        lastLoginAt: new Date(),
        lastLoginIp: meta.ip,
      });

      isNewUser = true;
    }

    // 5. Check if account is active
    if (!user.isActive) {
      throw new AppError(
        403,
        "Your account has been deactivated. Contact support.",
      );
    }

    // 6. Generate JWT token pair
    const tokenPair = await authService.generateTokenPair(user, meta);

    // 7. Return result
    const userObj = user.toJSON() as IUser;

    return {
      user: userObj,
      tokens: tokenPair,
      isNewUser,
    };
  }

  /**
   * Fetch Google user profile using access token
   */
  private async fetchGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new AppError(502, "Failed to fetch Google user profile");
    }

    const data = (await response.json()) as GoogleUserInfo;
    return data;
  }
}

// ── Export Singleton ──────────────────────────────────
export const googleOAuthService = new GoogleOAuthService();
