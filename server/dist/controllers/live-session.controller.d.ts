import type { Request, Response } from "express";
export declare const createSession: (req: Request, res: Response) => Promise<void>;
export declare const getMentorSessions: (req: Request, res: Response) => Promise<void>;
export declare const getSessionById: (req: Request, res: Response) => Promise<void>;
export declare const updateSession: (req: Request, res: Response) => Promise<void>;
export declare const completeSession: (req: Request, res: Response) => Promise<void>;
export declare const deleteSession: (req: Request, res: Response) => Promise<void>;
export declare const joinSession: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=live-session.controller.d.ts.map