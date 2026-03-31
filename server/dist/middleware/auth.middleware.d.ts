import type { Request, Response, NextFunction } from "express";
/**
 * Middleware to verify JWT access token
 * Token can be in:
 *   1. Authorization header: "Bearer <token>"
 *   2. Cookie: "accessToken"
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to restrict access to specific roles
 */
export declare const authorize: (...roles: Array<"student" | "mentor" | "recruiter">) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map