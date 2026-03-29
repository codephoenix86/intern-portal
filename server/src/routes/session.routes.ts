import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { joinSession } from "../controllers/live-session.controller.js";
import { getAvailableSessions } from "../controllers/student.controller.js";

const router = Router();

router.get(
  "/available",
  authenticate,
  authorize("student"),
  getAvailableSessions,
);
router.post("/:id/join", authenticate, joinSession);

export default router;
