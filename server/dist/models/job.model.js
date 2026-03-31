import { Schema, model } from "mongoose";
const jobSchema = new Schema({
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    workType: {
        type: String,
        enum: ["Remote", "Hybrid", "On-site"],
        required: true,
    },
    duration: { type: String, required: true, maxlength: 64 },
    stipend: { type: String, required: true, maxlength: 64 },
    skills: [{ type: String, trim: true }],
    description: { type: String, required: true, maxlength: 8000 },
    requirements: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true } });
jobSchema.index({ company: 1, isActive: 1 });
jobSchema.index({ title: "text", company: "text", skills: "text" });
export const Job = model("Job", jobSchema);
//# sourceMappingURL=job.model.js.map