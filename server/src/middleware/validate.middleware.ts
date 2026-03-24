import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { sendError } from "../utils/response.utils.js";

/**
 * Middleware to validate request body against a Zod schema
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        const field = issue.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(issue.message);
      }

      sendError(res, 400, "Validation failed", errors);
      return;
    }

    // Replace body with parsed & validated data
    req.body = result.data;
    next();
  };
};
