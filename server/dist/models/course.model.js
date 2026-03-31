import { Schema, model } from "mongoose";
// ── Sub-schemas ──────────────────────────────────────
const moduleSchema = new Schema({
    title: {
        type: String,
        required: [true, "Module title is required"],
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        default: "",
        maxlength: 1000,
    },
    contentUrl: {
        type: String,
        default: null, // Cloudinary URL
    },
    contentType: {
        type: String,
        enum: ["video", "pdf", "notes", "link"],
        default: "video",
    },
    duration: {
        type: String,
        default: "",
    },
    order: {
        type: Number,
        required: true,
        min: 0,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
}, { _id: true });
const pricingSchema = new Schema({
    amount: {
        type: Number,
        default: 0,
        min: [0, "Price cannot be negative"],
    },
    currency: {
        type: String,
        default: "INR",
        enum: ["INR", "USD"],
    },
    discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    discountedAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { _id: false });
// ── Main Schema ──────────────────────────────────────
const courseSchema = new Schema({
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Mentor ID is required"],
    },
    // ── Basic Info ──
    title: {
        type: String,
        required: [true, "Course title is required"],
        trim: true,
        maxlength: [200, "Title must not exceed 200 characters"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxlength: [5000, "Description must not exceed 5000 characters"],
    },
    shortDescription: {
        type: String,
        default: "",
        maxlength: [300, "Short description must not exceed 300 characters"],
    },
    level: {
        type: String,
        enum: {
            values: ["Beginner", "Intermediate", "Advanced"],
            message: "Level must be Beginner, Intermediate, or Advanced",
        },
        required: [true, "Course level is required"],
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
    },
    skills: {
        type: [String],
        default: [],
        validate: {
            validator: (v) => v.length <= 20,
            message: "Maximum 20 skills allowed",
        },
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },
    // ── Content ──
    modules: {
        type: [moduleSchema],
        default: [],
    },
    thumbnailUrl: {
        type: String,
        default: null, // Cloudinary
    },
    previewVideoUrl: {
        type: String,
        default: null, // Cloudinary
    },
    // ── Pricing ──
    pricing: {
        type: pricingSchema,
        default: () => ({
            amount: 0,
            currency: "INR",
            discountPercent: 0,
            discountedAmount: 0,
        }),
    },
    // ── Status ──
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishedAt: {
        type: Date,
        default: null,
    },
    // ── Stats ──
    enrollmentCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    completionCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalRatings: {
        type: Number,
        default: 0,
        min: 0,
    },
    // ── SEO ──
    slug: {
        type: String,
        unique: true,
        lowercase: true,
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
// ── Pre-Save: Auto-generate slug ─────────────────────
courseSchema.pre("save", function () {
    if (this.isModified("title") || !this.slug) {
        const baseSlug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
        // Add unique suffix
        const uniqueSuffix = this._id
            ? this._id.toString().slice(-6)
            : Math.random().toString(36).slice(2, 8);
        this.slug = `${baseSlug}-${uniqueSuffix}`;
    }
    // Auto-compute discounted amount
    if (this.pricing && this.pricing.discountPercent > 0) {
        this.pricing.discountedAmount = Math.round(this.pricing.amount * (1 - this.pricing.discountPercent / 100));
    }
    else if (this.pricing) {
        this.pricing.discountedAmount = this.pricing.amount;
    }
});
// ── Instance Methods ─────────────────────────────────
courseSchema.methods.isFree = function () {
    return this.pricing.amount === 0;
};
courseSchema.methods.publish = async function () {
    this.isPublished = true;
    this.publishedAt = new Date();
    return this.save();
};
courseSchema.methods.unpublish = async function () {
    this.isPublished = false;
    this.publishedAt = null;
    return this.save();
};
courseSchema.methods.incrementEnrollment = async function () {
    this.enrollmentCount += 1;
    return this.save();
};
// ── Virtuals ─────────────────────────────────────────
courseSchema.virtual("totalModules").get(function () {
    return this.modules.length;
});
courseSchema.virtual("freeModulesCount").get(function () {
    return this.modules.filter((m) => m.isFree).length;
});
courseSchema.virtual("completionRate").get(function () {
    if (this.enrollmentCount === 0)
        return 0;
    return Math.round((this.completionCount / this.enrollmentCount) * 100);
});
// ── Statics ──────────────────────────────────────────
courseSchema.statics.findPublished = function () {
    return this.find({ isPublished: true });
};
courseSchema.statics.findByMentor = function (mentorId) {
    return this.find({ mentorId });
};
// ── Indexes ──────────────────────────────────────────
courseSchema.index({ mentorId: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ skills: 1 });
courseSchema.index({ level: 1, isPublished: 1 });
courseSchema.index({ "pricing.amount": 1 });
courseSchema.index({
    title: "text",
    description: "text",
    skills: "text",
    category: "text",
});
courseSchema.index({ averageRating: -1, enrollmentCount: -1 });
// ── Export ───────────────────────────────────────────
export const Course = model("Course", courseSchema);
//# sourceMappingURL=course.model.js.map