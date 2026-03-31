import { type Types } from "mongoose";
export interface IRefreshToken {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    ip: string | null;
    userAgent: string | null;
    createdAt: Date;
}
export declare const RefreshToken: import("mongoose").Model<IRefreshToken, {}, {}, {}, import("mongoose").Document<unknown, {}, IRefreshToken, {}, import("mongoose").DefaultSchemaOptions> & IRefreshToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRefreshToken>;
//# sourceMappingURL=refresh-token.model.d.ts.map