import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import {
  googleCallback,
  initiateGoogleAuth,
} from "../controllers/google-oauth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken);

// Google OAuth2.0
router.get("/google", initiateGoogleAuth);
router.get("/google/callback", googleCallback);

router.post("/logout", logout);
router.post("/logout-all", authenticate, logoutAll);
router.get("/me", authenticate, getMe);

export default router;
