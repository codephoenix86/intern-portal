import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
/**
 * Middleware to validate request body against a Zod schema
 */
export declare const validate: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.middleware.d.ts.map