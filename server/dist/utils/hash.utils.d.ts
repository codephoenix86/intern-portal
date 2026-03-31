/**
 * Hash a plain text password using Argon2id
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * Verify a password against an Argon2 hash
 */
export declare const verifyPassword: (hash: string, password: string) => Promise<boolean>;
//# sourceMappingURL=hash.utils.d.ts.map