import crypto from "crypto";

/**
 * Generate a unique short code (e.g., for certificates, verification)
 */
export const generateShortCode = (length: number = 8): string => {
  return crypto
    .randomBytes(length)
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
};

/**
 * Generate a verification token
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
