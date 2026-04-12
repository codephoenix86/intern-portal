import dotenv from "dotenv";
// Non-production: `.env` overrides pre-set shell/IDE variables so local edits
// (e.g. CLIENT_URL matching Vite) are not ignored — dotenv default skips existing keys.
dotenv.config({ override: process.env.NODE_ENV !== "production" });
const getEnv = (key, fallback) => {
    const value = process.env[key] ?? fallback;
    if (!value) {
        throw new Error(`❌ Missing environment variable: ${key}`);
    }
    return value;
};
export const ENV = {
    PORT: parseInt(getEnv("PORT", "5000")),
    NODE_ENV: getEnv("NODE_ENV", "development"),
    MONGODB_URI: process.env["MONGODB_URI"] ?? "",
    ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET", "dev-access-secret"),
    REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET", "dev-refresh-secret"),
    ACCESS_TOKEN_EXPIRY: getEnv("ACCESS_TOKEN_EXPIRY", "15m"),
    REFRESH_TOKEN_EXPIRY: getEnv("REFRESH_TOKEN_EXPIRY", "7d"),
    // CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME", ""),
    // CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY", ""),
    // CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET", ""),
    // RESEND_API_KEY: getEnv("RESEND_API_KEY", ""),
    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", "disabled-google-client-id"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", "disabled-google-client-secret"),
    GOOGLE_REDIRECT_URI: getEnv("GOOGLE_REDIRECT_URI", "http://localhost:5000/api/auth/google/callback"),
    // GITHUB_CLIENT_ID: getEnv("GITHUB_CLIENT_ID", ""),
    // GITHUB_CLIENT_SECRET: getEnv("GITHUB_CLIENT_SECRET", ""),
    CLIENT_URL: getEnv("CLIENT_URL", "http://localhost:8080"),
};
//# sourceMappingURL=env.js.map