import type { Request, Response } from "express";
export declare const sendFriendRequest: (req: Request, res: Response) => Promise<void>;
export declare const respondFriendRequest: (req: Request, res: Response) => Promise<void>;
export declare const removeFriend: (req: Request, res: Response) => Promise<void>;
export declare const cancelFriendRequest: (req: Request, res: Response) => Promise<void>;
export declare const followUser: (req: Request, res: Response) => Promise<void>;
export declare const unfollowUser: (req: Request, res: Response) => Promise<void>;
export declare const listFriends: (req: Request, res: Response) => Promise<void>;
export declare const listPendingRequests: (req: Request, res: Response) => Promise<void>;
export declare const listFollowingRecruiters: (req: Request, res: Response) => Promise<void>;
export declare const listFollowingMentors: (req: Request, res: Response) => Promise<void>;
export declare const getBulkFriendStatuses: (req: Request, res: Response) => Promise<void>;
export declare const getBulkFollowStatuses: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=connection.controller.d.ts.map