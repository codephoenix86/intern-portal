import { Schema, model, type Types, type Document } from "mongoose";

// ── Interface ────────────────────────────────────────
export interface ILiveSession {
  _id: Types.ObjectId;
  mentorId: Types.ObjectId;
  courseId: Types.ObjectId | null;

  // Session Info
  topic: string;
  description: string;
  date: string; // e.g. "2025-02-15"
  time: string; // e.g. "18:00"
  scheduledAt: Date; // Computed: date + time as ISO Date
  duration: number; // Duration in minutes (default 60)

  // Session Type & Access
  type: "free_demo" | "paid_class";
  link: string | null; // Generated meeting link
  accessCode: string | null; // For paid classes only

  // Capacity
  maxAttendees: number;
  attendeeCount: number;
  attendees: Types.ObjectId[]; // Student IDs who joined

  // Status
  status: "scheduled" | "live" | "completed" | "cancelled";
  isCompleted: boolean;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancelReason: string | null;

  // Recording (for later)
  recordingUrl: string | null; // Cloudinary URL

  createdAt: Date;
  updatedAt: Date;
}

// ── Methods Interface ────────────────────────────────
export interface ILiveSessionMethods {
  isFull(): boolean;
  hasStudentJoined(studentId: string): boolean;
  markAsLive(): Promise<ILiveSessionDocument>;
  markAsCompleted(): Promise<ILiveSessionDocument>;
  markAsCancelled(reason: string): Promise<ILiveSessionDocument>;
}

export type ILiveSessionDocument = Document &
  ILiveSession &
  ILiveSessionMethods;

// ── Schema ───────────────────────────────────────────
const liveSessionSchema = new Schema<ILiveSession, any, ILiveSessionMethods>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Mentor ID is required"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    // ── Session Info ──
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      maxlength: [200, "Topic must not exceed 200 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [2000, "Description must not exceed 2000 characters"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      validate: {
        validator: (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v),
        message: "Date must be in YYYY-MM-DD format",
      },
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      validate: {
        validator: (v: string) => /^\d{2}:\d{2}$/.test(v),
        message: "Time must be in HH:MM format",
      },
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 60,
      min: [15, "Duration must be at least 15 minutes"],
      max: [480, "Duration must not exceed 480 minutes"],
    },

    // ── Type & Access ──
    type: {
      type: String,
      enum: {
        values: ["free_demo", "paid_class"],
        message: "Type must be free_demo or paid_class",
      },
      required: [true, "Session type is required"],
    },
    link: {
      type: String,
      default: null,
    },
    accessCode: {
      type: String,
      default: null,
    },

    // ── Capacity ──
    maxAttendees: {
      type: Number,
      default: 100,
      min: [1, "Must allow at least 1 attendee"],
      max: [1000, "Maximum 1000 attendees"],
    },
    attendeeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    attendees: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    // ── Status ──
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      default: null,
      maxlength: 500,
    },

    // ── Recording ──
    recordingUrl: {
      type: String,
      default: null, // Cloudinary URL (for later)
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

// ── Pre-Save: Compute scheduledAt ────────────────────
liveSessionSchema.pre("save", function () {
  if (this.isModified("date") || this.isModified("time")) {
    try {
      this.scheduledAt = new Date(`${this.date}T${this.time}:00`);
    } catch {
      // If parsing fails, leave as null
    }
  }
});

// ── Instance Methods ─────────────────────────────────
liveSessionSchema.methods.isFull = function (): boolean {
  return this.attendeeCount >= this.maxAttendees;
};

liveSessionSchema.methods.hasStudentJoined = function (
  studentId: string,
): boolean {
  return this.attendees.some(
    (id: Types.ObjectId) => id.toString() === studentId,
  );
};

liveSessionSchema.methods.markAsLive = async function () {
  this.status = "live";
  return this.save();
};

liveSessionSchema.methods.markAsCompleted = async function () {
  this.status = "completed";
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

liveSessionSchema.methods.markAsCancelled = async function (reason: string) {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  this.cancelReason = reason;
  return this.save();
};

// ── Virtuals ─────────────────────────────────────────
liveSessionSchema.virtual("isUpcoming").get(function () {
  if (!this.scheduledAt) return false;
  return this.scheduledAt > new Date() && this.status === "scheduled";
});

liveSessionSchema.virtual("spotsLeft").get(function () {
  return Math.max(0, this.maxAttendees - this.attendeeCount);
});

// ── Indexes ──────────────────────────────────────────
liveSessionSchema.index({ mentorId: 1, status: 1 });
liveSessionSchema.index({ mentorId: 1, isCompleted: 1 });
liveSessionSchema.index({ courseId: 1 });
liveSessionSchema.index({ type: 1 });
liveSessionSchema.index({ scheduledAt: 1 });
liveSessionSchema.index({ accessCode: 1 });
liveSessionSchema.index({ status: 1, scheduledAt: 1 });

// ── Export ───────────────────────────────────────────
export const LiveSession = model<ILiveSession>(
  "LiveSession",
  liveSessionSchema,
);
