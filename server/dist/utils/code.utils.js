import crypto from "crypto";
/**
 * Generate a unique short code (e.g., for certificates, verification)
 */
export const generateShortCode = (length = 8) => {
    return crypto
        .randomBytes(length)
        .toString("hex")
        .slice(0, length)
        .toUpperCase();
};
/**
 * Generate a verification token
 */
export const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};
//# sourceMappingURL=code.utils.js.map