import jwt, {} from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env.js";
// ── Access Token ─────────────────────────────────────
/**
 * Generate a short-lived access token (15 min)
 */
export const generateAccessToken = (payload) => {
    const accessTokenExpiry = ENV.ACCESS_TOKEN_EXPIRY;
    const options = {
        expiresIn: accessTokenExpiry,
    };
    return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, options);
};
/**
 * Verify and decode an access token
 */
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
};
// ── Refresh Token ────────────────────────────────────
/**
 * Generate a long-lived refresh token (7 days)
 */
export const generateRefreshToken = (payload) => {
    const refreshTokenExpiry = ENV.REFRESH_TOKEN_EXPIRY;
    const options = {
        expiresIn: refreshTokenExpiry,
    };
    return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, options);
};
/**
 * Verify and decode a refresh token
 */
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
};
// ── Utility ──────────────────────────────────────────
/**
 * Generate unique token ID for refresh token tracking
 */
export const generateTokenId = () => {
    return crypto.randomUUID();
};
/**
 * Calculate refresh token expiry date
 */
export const getRefreshTokenExpiry = () => {
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
    }
    else {
        // Default: 7 days
        expiry.setDate(expiry.getDate() + 7);
    }
    return expiry;
};
//# sourceMappingURL=token.utils.js.map