import { Schema, model, Types, type Document } from "mongoose";

// ── Sub-interface ────────────────────────────────────
export interface IModuleProgress {
  moduleId: Types.ObjectId;
  completed: boolean;
  completedAt: Date | null;
  timeSpent: number; // Time spent in minutes
}

// ── Main Interface ───────────────────────────────────
export interface IEnrollment {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  mentorId: Types.ObjectId; // Denormalized for fast queries

  // Progress
  progress: number; // 0-100 computed
  moduleProgress: IModuleProgress[];
  lastAccessedAt: Date | null;

  // Status
  status: "active" | "completed" | "dropped";
  isCompleted: boolean;
  completedAt: Date | null;

  // Certificate
  certificateIssued: boolean;
  certificateId: Types.ObjectId | null;

  // Payment (for paid courses)
  paymentStatus: "free" | "paid" | "pending" | "refunded";
  paymentAmount: number;
  paymentId: string | null; // Payment gateway transaction ID

  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Methods ──────────────────────────────────────────
export interface IEnrollmentMethods {
  completeModule(moduleId: string): Promise<IEnrollmentDocument>;
  calculateProgress(totalModules: number): number;
  markCompleted(): Promise<IEnrollmentDocument>;
  drop(): Promise<IEnrollmentDocument>;
}

export type IEnrollmentDocument = Document & IEnrollment & IEnrollmentMethods;

// ── Sub-schemas ──────────────────────────────────────
const moduleProgressSchema = new Schema<IModuleProgress>(
  {
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
  },
  { _id: false },
);

// ── Main Schema ──────────────────────────────────────
const enrollmentSchema = new Schema<IEnrollment, any, IEnrollmentMethods>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  },
);

// ── Instance Methods ─────────────────────────────────

/**
 * Mark a specific module as completed
 */
enrollmentSchema.methods.completeModule = async function (moduleId: string) {
  const existing = this.moduleProgress.find(
    (mp: IModuleProgress) => mp.moduleId.toString() === moduleId,
  );

  if (existing) {
    existing.completed = true;
    existing.completedAt = new Date();
  } else {
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
enrollmentSchema.methods.calculateProgress = function (
  totalModules: number,
): number {
  if (totalModules === 0) return 0;
  const completedCount = this.moduleProgress.filter(
    (mp: IModuleProgress) => mp.completed,
  ).length;
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
enrollmentSchema.pre<IEnrollmentDocument>("save", function () {
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
export const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
