import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { joinSession } from "../controllers/live-session.controller.js";

const router = Router();

router.post("/:id/join", authenticate, joinSession);

export default router;
