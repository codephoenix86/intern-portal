import { type IUser } from "../models/user.model.js";
import { type TokenPair } from "./auth.service.js";
interface OAuthResult {
    user: IUser;
    tokens: TokenPair;
    isNewUser: boolean;
}
interface SessionMeta {
    ip: string | null;
    userAgent: string | null;
}
declare class GoogleOAuthService {
    /**
     * Step 1: Generate authorization URL
     * Returns URL + state + codeVerifier to store in cookie
     */
    createAuthorizationURL(): {
        url: string;
        state: string;
        codeVerifier: string;
    };
    /**
     * Step 2: Exchange authorization code for tokens
     * and fetch Google user profile
     */
    handleCallback(code: string, codeVerifier: string, role: IUser["role"] | null, meta: SessionMeta): Promise<OAuthResult>;
    /**
     * Fetch Google user profile using access token
     */
    private fetchGoogleUser;
}
export declare const googleOAuthService: GoogleOAuthService;
export {};
//# sourceMappingURL=google-oauth.service.d.ts.map