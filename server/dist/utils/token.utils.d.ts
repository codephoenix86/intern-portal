export interface AccessTokenPayload {
    userId: string;
    email: string;
    role: "student" | "mentor" | "recruiter";
}
export interface RefreshTokenPayload {
    userId: string;
    tokenId: string;
}
/**
 * Generate a short-lived access token (15 min)
 */
export declare const generateAccessToken: (payload: AccessTokenPayload) => string;
/**
 * Verify and decode an access token
 */
export declare const verifyAccessToken: (token: string) => AccessTokenPayload;
/**
 * Generate a long-lived refresh token (7 days)
 */
export declare const generateRefreshToken: (payload: RefreshTokenPayload) => string;
/**
 * Verify and decode a refresh token
 */
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload;
/**
 * Generate unique token ID for refresh token tracking
 */
export declare const generateTokenId: () => string;
/**
 * Calculate refresh token expiry date
 */
export declare const getRefreshTokenExpiry: () => Date;
//# sourceMappingURL=token.utils.d.ts.map