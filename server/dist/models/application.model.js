import { Schema, model } from "mongoose";
export const APPLICATION_STATUSES = [
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Rejected",
];
const applicationSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: APPLICATION_STATUSES,
        default: "Applied",
    },
    matchScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
}, { timestamps: true });
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, status: 1 });
export const Application = model("Application", applicationSchema);
//# sourceMappingURL=application.model.js.map