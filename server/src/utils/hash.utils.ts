import argon2 from "argon2";

/**
 * Hash a plain text password using Argon2id
 */
export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 iterations
    parallelism: 4,
  });
};

/**
 * Verify a password against an Argon2 hash
 */
export const verifyPassword = async (
  hash: string,
  password: string,
): Promise<boolean> => {
  return argon2.verify(hash, password);
};
