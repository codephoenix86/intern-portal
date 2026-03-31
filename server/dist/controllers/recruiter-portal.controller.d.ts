import type { Request, Response } from "express";
export declare const getDashboard: (req: Request, res: Response) => Promise<void>;
export declare const listJobs: (req: Request, res: Response) => Promise<void>;
export declare const getJob: (req: Request, res: Response) => Promise<void>;
export declare const postJob: (req: Request, res: Response) => Promise<void>;
export declare const patchJob: (req: Request, res: Response) => Promise<void>;
export declare const closeJob: (req: Request, res: Response) => Promise<void>;
export declare const listApplicants: (req: Request, res: Response) => Promise<void>;
export declare const patchApplication: (req: Request, res: Response) => Promise<void>;
export declare const getProfile: (req: Request, res: Response) => Promise<void>;
export declare const patchProfile: (req: Request, res: Response) => Promise<void>;
export declare const listNotifications: (req: Request, res: Response) => Promise<void>;
export declare const markNotificationRead: (req: Request, res: Response) => Promise<void>;
export declare const markAllNotificationsRead: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=recruiter-portal.controller.d.ts.map