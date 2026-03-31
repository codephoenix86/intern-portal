import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSessionSchema, updateSessionSchema, } from "../validators/live-session.validator.js";
import { createSession, getMentorSessions, getSessionById, updateSession, completeSession, deleteSession, } from "../controllers/live-session.controller.js";
const router = Router();
// All mentor routes require authentication + mentor role
router.use(authenticate);
router.use(authorize("mentor"));
// session routes
router.post("/sessions", validate(createSessionSchema), createSession);
router.get("/sessions", getMentorSessions);
router.get("/sessions/:id", getSessionById);
router.put("/sessions/:id", validate(updateSessionSchema), updateSession);
router.patch("/sessions/:id/complete", completeSession);
router.delete("/sessions/:id", deleteSession);
export default router;
//# sourceMappingURL=mentor.routes.js.map