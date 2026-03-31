import { type IUser } from "../models/user.model.js";
import type { RegisterInput } from "../validators/auth.validator.js";
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
declare class AuthService {
    /**
     * Register a new user
     */
    register(input: RegisterInput, meta: SessionMeta): Promise<RegisterResult>;
    /**
     * Generate Access + Refresh token pair
     */
    generateTokenPair(user: IUser, meta: SessionMeta): Promise<TokenPair>;
    /**
     * Login an existing user
     */
    login(email: string, password: string, meta: SessionMeta): Promise<RegisterResult>;
    /**
     * Refresh access token using refresh token
     */
    refreshAccessToken(refreshTokenJWT: string, meta: SessionMeta): Promise<TokenPair>;
    /**
     * Logout — delete the refresh token
     */
    logout(refreshTokenJWT: string): Promise<void>;
    /**
     * Logout from all devices — delete all refresh tokens for a user
     */
    logoutAll(userId: string): Promise<void>;
    /**
     * Get current user by ID
     */
    getCurrentUser(userId: string): Promise<IUser | null>;
}
export declare class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map