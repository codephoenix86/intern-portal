import { Google } from "arctic";
import { ENV } from "./env.js";

/**
 * Arctic Google OAuth 2.0 client
 * Handles authorization URL generation and token exchange
 */
export const googleOAuth = new Google(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  ENV.GOOGLE_REDIRECT_URI,
);
