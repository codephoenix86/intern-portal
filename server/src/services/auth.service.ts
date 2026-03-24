import { User, type IUser } from "../models/user.model.js";
import { RefreshToken } from "../models/refresh-token.model.js";
import { hashPassword, verifyPassword } from "../utils/hash.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenId,
  getRefreshTokenExpiry,
  verifyRefreshToken,
  type AccessTokenPayload,
} from "../utils/token.utils.js";
import type { RegisterInput } from "../validators/auth.validator.js";

// ── Types ────────────────────────────────────────────
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResult {
  user: IUser;
  tokens: TokenPair;
}

interface SessionMeta {
  ip: string | null;
  userAgent: string | null;
}

// ── Service Class ────────────────────────────────────
class AuthService {
  /**
   * Register a new user
   */
  async register(
    input: RegisterInput,
    meta: SessionMeta,
  ): Promise<RegisterResult> {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new AppError(409, "An account with this email already exists");
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(input.password);

    // 3. Create user
    const user = await User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      provider: "local",
      isVerified: false,
      lastLoginAt: new Date(),
      lastLoginIp: meta.ip,
    });

    // 4. Generate token pair
    const tokens = await this.generateTokenPair(user, meta);

    // 5. Return user (without password) + tokens
    const userObj = user.toJSON() as IUser;

    return { user: userObj, tokens };
  }

  /**
   * Generate Access + Refresh token pair
   */
  async generateTokenPair(user: IUser, meta: SessionMeta): Promise<TokenPair> {
    // Access token payload
    const accessPayload: AccessTokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(accessPayload);

    // Refresh token
    const tokenId = generateTokenId();
    const refreshTokenJWT = generateRefreshToken({
      userId: user._id.toString(),
      tokenId,
    });

    // Store refresh token in DB
    await RefreshToken.create({
      userId: user._id,
      token: refreshTokenJWT,
      expiresAt: getRefreshTokenExpiry(),
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    return {
      accessToken,
      refreshToken: refreshTokenJWT,
    };
  }

  /**
   * Login an existing user
   */
  async login(
    email: string,
    password: string,
    meta: SessionMeta,
  ): Promise<RegisterResult> {
    // 1. Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // 2. Check if user uses OAuth (no password)
    if (!user.password) {
      throw new AppError(
        401,
        `This account uses ${user.provider} login. Please use ${user.provider} to sign in.`,
      );
    }

    // 3. Verify password
    const isValid = await verifyPassword(user.password, password);
    if (!isValid) {
      throw new AppError(401, "Invalid email or password");
    }

    // 4. Check if account is active
    if (!user.isActive) {
      throw new AppError(
        403,
        "Your account has been deactivated. Contact support.",
      );
    }

    // 5. Update last login info
    user.lastLoginAt = new Date();
    user.lastLoginIp = meta.ip;
    await user.save();

    // 6. Generate token pair
    const tokens = await this.generateTokenPair(user, meta);

    // 7. Return user (without password) + tokens
    const userObj = user.toJSON() as IUser;

    return { user: userObj, tokens };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(
    refreshTokenJWT: string,
    meta: SessionMeta,
  ): Promise<TokenPair> {
    // 1. Verify the refresh token JWT
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshTokenJWT);
    } catch {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    // 2. Find the refresh token in DB
    const storedToken = await RefreshToken.findOne({
      token: refreshTokenJWT,
      userId: decoded.userId,
    });

    if (!storedToken) {
      // Possible token reuse attack — delete all tokens for this user
      await RefreshToken.deleteMany({ userId: decoded.userId });
      throw new AppError(
        401,
        "Refresh token not found. All sessions have been revoked for security.",
      );
    }

    // 3. Check expiry
    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      throw new AppError(
        401,
        "Refresh token has expired. Please log in again.",
      );
    }

    // 4. Delete old refresh token (rotate)
    await storedToken.deleteOne();

    // 5. Find the user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AppError(401, "User not found or account deactivated");
    }

    // 6. Generate new token pair
    const tokens = await this.generateTokenPair(user, meta);

    return tokens;
  }

  /**
   * Logout — delete the refresh token
   */
  async logout(refreshTokenJWT: string): Promise<void> {
    await RefreshToken.findOneAndDelete({ token: refreshTokenJWT });
  }

  /**
   * Logout from all devices — delete all refresh tokens for a user
   */
  async logoutAll(userId: string): Promise<void> {
    await RefreshToken.deleteMany({ userId });
  }

  /**
   * Get current user by ID
   */
  async getCurrentUser(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}

// ── Custom Error Class ───────────────────────────────
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

// ── Export Singleton ─────────────────────────────────
export const authService = new AuthService();
