import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env.js";

// ── Types ────────────────────────────────────────────
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: "student" | "mentor" | "recruiter" | null; // ← CHANGED: allow null
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

// ── Access Token ─────────────────────────────────────

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  const accessTokenExpiry = ENV.ACCESS_TOKEN_EXPIRY as NonNullable<
    SignOptions["expiresIn"]
  >;
  const options: SignOptions = {
    expiresIn: accessTokenExpiry,
  };
  return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET as string, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
};

// ── Refresh Token ────────────────────────────────────

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const refreshTokenExpiry = ENV.REFRESH_TOKEN_EXPIRY as NonNullable<
    SignOptions["expiresIn"]
  >;
  const options: SignOptions = {
    expiresIn: refreshTokenExpiry,
  };
  return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET as string, options);
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(
    token,
    ENV.REFRESH_TOKEN_SECRET as string,
  ) as RefreshTokenPayload;
};

// ── Utility ──────────────────────────────────────────

export const generateTokenId = (): string => {
  return crypto.randomUUID();
};

export const getRefreshTokenExpiry = (): Date => {
  const expiry = new Date();
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
    expiry.setDate(expiry.getDate() + 7);
  }
  return expiry;
};
