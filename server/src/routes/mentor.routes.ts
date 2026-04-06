import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { courseContentUpload } from "../config/upload.config.js";
import {
  createSessionSchema,
  updateSessionSchema,
} from "../validators/live-session.validator.js";
import {
  createMentorCourseSchema,
  updateMentorCourseSchema,
  addCourseModuleSchema,
  updateCourseModuleSchema,
} from "../validators/mentor-course.validator.js";
import {
  createSession,
  getMentorSessions,
  getSessionById,
  updateSession,
  completeSession,
  deleteSession,
} from "../controllers/live-session.controller.js";
import {
  listMentorCourses,
  createMentorCourse,
  getMentorCourse,
  updateMentorCourse,
  addMentorCourseModule,
  updateMentorCourseModule,
  uploadMentorModuleContent,
  listMentorCourseStudents,
} from "../controllers/mentor-course.controller.js";

const router = Router();

// All mentor routes require authentication + mentor role
router.use(authenticate);
router.use(authorize("mentor"));

// course routes (specific paths before generic :courseId)
router.get("/courses", listMentorCourses);
router.post(
  "/courses",
  validate(createMentorCourseSchema),
  createMentorCourse,
);
router.get("/courses/:courseId/students", listMentorCourseStudents);
router.get("/courses/:courseId", getMentorCourse);
router.patch(
  "/courses/:courseId",
  validate(updateMentorCourseSchema),
  updateMentorCourse,
);
router.post(
  "/courses/:courseId/modules",
  validate(addCourseModuleSchema),
  addMentorCourseModule,
);
router.patch(
  "/courses/:courseId/modules/:moduleId",
  validate(updateCourseModuleSchema),
  updateMentorCourseModule,
);
router.post(
  "/courses/:courseId/modules/:moduleId/content",
  courseContentUpload.single("file"),
  uploadMentorModuleContent,
);

// session routes
router.post("/sessions", validate(createSessionSchema), createSession);
router.get("/sessions", getMentorSessions);
router.get("/sessions/:id", getSessionById);
router.put("/sessions/:id", validate(updateSessionSchema), updateSession);
router.patch("/sessions/:id/complete", completeSession);
router.delete("/sessions/:id", deleteSession);

export default router;
