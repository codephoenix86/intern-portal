import type { Response } from "express";
export declare const sendSuccess: <T>(res: Response, statusCode: number, message: string, data?: T) => void;
export declare const sendError: (res: Response, statusCode: number, message: string, errors?: Record<string, string[]>) => void;
//# sourceMappingURL=response.utils.d.ts.map