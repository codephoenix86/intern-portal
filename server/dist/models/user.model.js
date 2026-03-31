import { Schema, model } from "mongoose";
// ── Schema ───
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        default: null,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ["student", "mentor", "recruiter"],
        required: true,
    },
    avatar: {
        type: String,
        default: null, // Cloudinary URL
    },
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local",
    },
    providerId: {
        type: String,
        default: null,
    },
    // ── Student Fields ──
    phone: {
        type: String,
        default: null,
        trim: true,
    },
    college: {
        type: String,
        default: null,
        trim: true,
        maxlength: 200,
    },
    branch: {
        type: String,
        default: null,
        trim: true,
        maxlength: 120,
    },
    location: {
        type: String,
        default: null,
        trim: true,
        maxlength: 120,
    },
    cgpa: {
        type: String,
        default: null,
        trim: true,
        maxlength: 10,
    },
    semester: {
        type: String,
        default: null,
        trim: true,
        maxlength: 50,
    },
    experienceSummary: {
        type: String,
        default: null,
        trim: true,
        maxlength: 2000,
    },
    studentSkills: {
        type: [String],
        default: [],
    },
    studentProjects: {
        type: [String],
        default: [],
    },
    achievements: {
        type: [String],
        default: [],
    },
    targetJobRole: {
        type: String,
        default: null,
        trim: true,
        maxlength: 200,
    },
    targetSalary: {
        type: Number,
        default: null,
        min: 0,
    },
    targetCompanies: {
        type: [String],
        default: [],
    },
    codingProfiles: {
        leetcode: { type: String, default: null, trim: true },
        codechef: { type: String, default: null, trim: true },
        codeforces: { type: String, default: null, trim: true },
        github: { type: String, default: null, trim: true },
        linkedin: { type: String, default: null, trim: true },
        portfolio: { type: String, default: null, trim: true },
    },
    resumeUrl: {
        type: String,
        default: null,
    },
    parsedResume: {
        type: Schema.Types.Mixed,
        default: null,
    },
    profileViews: {
        type: Number,
        default: 0,
        min: 0,
    },
    roadmapTasks: {
        type: [
            {
                id: { type: String, required: true },
                title: { type: String, required: true },
                category: { type: String, required: true },
                completed: { type: Boolean, default: false },
            },
        ],
        default: [],
    },
    roadmapInterests: {
        type: [String],
        default: [],
    },
    // ── Mentor Fields ──
    expertise: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: null,
        maxlength: 500,
    },
    // ── Recruiter Fields ──
    companyName: {
        type: String,
        default: null,
        trim: true,
    },
    companyEmail: {
        type: String,
        default: null,
        lowercase: true,
        trim: true,
    },
    // ── Common ──
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLoginAt: {
        type: Date,
        default: null,
    },
    lastLoginIp: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        },
    },
});
// ── Indexes ───
userSchema.index({ role: 1 });
userSchema.index({ provider: 1, providerId: 1 });
export const User = model("User", userSchema);
//# sourceMappingURL=user.model.js.map