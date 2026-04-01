import { type Types } from "mongoose";
export type ConnectionType = "friend" | "follow";
export type ConnectionStatus = "pending" | "accepted" | "rejected";
export interface IConnection {
    _id: Types.ObjectId;
    fromUser: Types.ObjectId;
    toUser: Types.ObjectId;
    type: ConnectionType;
    /** Only relevant for type=friend. follow is always "accepted" immediately. */
    status: ConnectionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Connection: import("mongoose").Model<IConnection, {}, {}, {}, import("mongoose").Document<unknown, {}, IConnection, {}, import("mongoose").DefaultSchemaOptions> & IConnection & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IConnection>;
//# sourceMappingURL=connection.model.d.ts.map