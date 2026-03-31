import { Schema, model } from "mongoose";
const refreshTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    ip: {
        type: String,
        default: null,
    },
    userAgent: {
        type: String,
        default: null,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
// Auto-delete expired tokens (TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1 });
export const RefreshToken = model("RefreshToken", refreshTokenSchema);
//# sourceMappingURL=refresh-token.model.js.map