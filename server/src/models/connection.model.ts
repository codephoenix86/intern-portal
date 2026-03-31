import { Schema, model, type Types } from "mongoose";

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

const connectionSchema = new Schema<IConnection>(
  {
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["friend", "follow"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Prevent duplicate connections
connectionSchema.index({ fromUser: 1, toUser: 1, type: 1 }, { unique: true });
// Fast lookup for "my friends", "my following", "pending requests"
connectionSchema.index({ toUser: 1, type: 1, status: 1 });
connectionSchema.index({ fromUser: 1, type: 1, status: 1 });

export const Connection = model<IConnection>("Connection", connectionSchema);
