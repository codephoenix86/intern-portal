import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env.js";

// ── Types ────────────────────────────────────────────
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: "student" | "mentor" | "recruiter";
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

// ── Access Token ─────────────────────────────────────

/**
 * Generate a short-lived access token (15 min)
 */
export const generateAccessToken = (payload: AccessTokenPayload): string => {
  const accessTokenExpiry = ENV.ACCESS_TOKEN_EXPIRY as NonNullable<
    SignOptions["expiresIn"]
  >;
  const options: SignOptions = {
    expiresIn: accessTokenExpiry,
  };
  return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET as string, options);
};

/**
 * Verify and decode an access token
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
};

// ── Refresh Token ────────────────────────────────────

/**
 * Generate a long-lived refresh token (7 days)
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const refreshTokenExpiry = ENV.REFRESH_TOKEN_EXPIRY as NonNullable<
    SignOptions["expiresIn"]
  >;
  const options: SignOptions = {
    expiresIn: refreshTokenExpiry,
  };
  return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET as string, options);
};

/**
 * Verify and decode a refresh token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(
    token,
    ENV.REFRESH_TOKEN_SECRET as string,
  ) as RefreshTokenPayload;
};

// ── Utility ──────────────────────────────────────────

/**
 * Generate unique token ID for refresh token tracking
 */
export const generateTokenId = (): string => {
  return crypto.randomUUID();
};

/**
 * Calculate refresh token expiry date
 */
export const getRefreshTokenExpiry = (): Date => {
  const expiry = new Date();
  // Parse '7d' -> 7 days
  const match = ENV.REFRESH_TOKEN_EXPIRY.match(/^(\d+)([dhms])$/);
  if (match) {
    const value = parseInt(match[1] ?? "7");
    const unit = match[2];
    switch (unit) {
      case "d":
        expiry.setDate(expiry.getDate() + value);
        break;
      case "h":
        expiry.setHours(expiry.getHours() + value);
        break;
      case "m":
        expiry.setMinutes(expiry.getMinutes() + value);
        break;
      case "s":
        expiry.setSeconds(expiry.getSeconds() + value);
        break;
    }
  } else {
    // Default: 7 days
    expiry.setDate(expiry.getDate() + 7);
  }
  return expiry;
};
