import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuth } from "../config/oauth.js";
import { User, type IUser } from "../models/user.model.js";
import { authService, AppError, type TokenPair } from "./auth.service.js";

// ── Types ────────────────────────────────────────────

interface GoogleUserInfo {
  sub: string;
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
      if (user.provider === "local") {
        user.provider = "google";
        user.providerId = googleUser.sub;
      }

      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }

      user.lastLoginAt = new Date();
      user.lastLoginIp = meta.ip;
      await user.save();
    } else {
      // ── New User ───────────────────────────────────
      // If role is provided (from register page), use it.
      // If not (from login page), set to null — user must select role.
      const userRole = role ?? null; // ← CHANGED: null instead of "student"

      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: null,
        role: userRole, // Can be null
        avatar: googleUser.picture ?? null,
        provider: "google",
        providerId: googleUser.sub,
        isVerified: true,
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

export const googleOAuthService = new GoogleOAuthService();
