import { Schema, model, Types } from "mongoose";
// ── Sub-schemas ──────────────────────────────────────
const moduleProgressSchema = new Schema({
    moduleId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    timeSpent: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { _id: false });
// ── Main Schema ──────────────────────────────────────
const enrollmentSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student ID is required"],
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course ID is required"],
    },
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Mentor ID is required"],
    },
    // ── Progress ──
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    moduleProgress: {
        type: [moduleProgressSchema],
        default: [],
    },
    lastAccessedAt: {
        type: Date,
        default: null,
    },
    // ── Status ──
    status: {
        type: String,
        enum: {
            values: ["active", "completed", "dropped"],
            message: "Status must be active, completed, or dropped",
        },
        default: "active",
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    // ── Certificate ──
    certificateIssued: {
        type: Boolean,
        default: false,
    },
    certificateId: {
        type: Schema.Types.ObjectId,
        ref: "Certificate",
        default: null,
    },
    // ── Payment ──
    paymentStatus: {
        type: String,
        enum: ["free", "paid", "pending", "refunded"],
        default: "free",
    },
    paymentAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    paymentId: {
        type: String,
        default: null,
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(_doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
// ── Instance Methods ─────────────────────────────────
/**
 * Mark a specific module as completed
 */
enrollmentSchema.methods.completeModule = async function (moduleId) {
    const existing = this.moduleProgress.find((mp) => mp.moduleId.toString() === moduleId);
    if (existing) {
        existing.completed = true;
        existing.completedAt = new Date();
    }
    else {
        this.moduleProgress.push({
            moduleId: new Types.ObjectId(moduleId),
            completed: true,
            completedAt: new Date(),
            timeSpent: 0,
        });
    }
    this.lastAccessedAt = new Date();
    return this.save();
};
/**
 * Calculate progress percentage based on completed modules
 */
enrollmentSchema.methods.calculateProgress = function (totalModules) {
    if (totalModules === 0)
        return 0;
    const completedCount = this.moduleProgress.filter((mp) => mp.completed).length;
    return Math.round((completedCount / totalModules) * 100);
};
/**
 * Mark enrollment as completed
 */
enrollmentSchema.methods.markCompleted = async function () {
    this.status = "completed";
    this.isCompleted = true;
    this.progress = 100;
    this.completedAt = new Date();
    return this.save();
};
/**
 * Drop the enrollment
 */
enrollmentSchema.methods.drop = async function () {
    this.status = "dropped";
    return this.save();
};
// ── Virtuals ─────────────────────────────────────────
enrollmentSchema.virtual("completedModulesCount").get(function () {
    return this.moduleProgress.filter((mp) => mp.completed).length;
});
enrollmentSchema.virtual("totalTimeSpent").get(function () {
    return this.moduleProgress.reduce((sum, mp) => sum + mp.timeSpent, 0);
});
// ── Pre-Save: Auto-recalculate progress ──────────────
enrollmentSchema.pre("save", function () {
    if (this.isModified("moduleProgress")) {
        const completed = this.moduleProgress.filter((mp) => mp.completed).length;
        const total = this.moduleProgress.length;
        if (total > 0) {
            this.progress = Math.round((completed / total) * 100);
        }
    }
});
// ── Indexes ──────────────────────────────────────────
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ studentId: 1, status: 1 });
enrollmentSchema.index({ mentorId: 1 });
enrollmentSchema.index({ mentorId: 1, courseId: 1 });
enrollmentSchema.index({ isCompleted: 1 });
enrollmentSchema.index({ paymentStatus: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
// ── Export ───────────────────────────────────────────
export const Enrollment = model("Enrollment", enrollmentSchema);
//# sourceMappingURL=enrollment.model.js.map