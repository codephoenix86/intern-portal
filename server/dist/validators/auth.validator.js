import { z } from "zod";
// Register schema
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),
    email: z.string().trim().email("Invalid email format").toLowerCase(),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    role: z.enum(["student", "mentor", "recruiter"], {
        error: "Role must be student, mentor, or recruiter",
    }),
});
// Login schema
export const loginSchema = z.object({
    email: z.string().trim().email("Invalid email format").toLowerCase(),
    password: z.string().min(1, "Password is required"),
});
// Refresh token schema
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required").optional(),
});
//# sourceMappingURL=auth.validator.js.map