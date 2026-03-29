import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { resumeUpload } from "../config/upload.config.js";
import {
  getDashboard,
  listJobs,
  listRecommended,
  getJob,
  getMatchScore,
  applyToJob,
  listApplications,
  getStudentProfile,
  patchStudentProfile,
  postResumeUpload,
  postParseResume,
  getQuiz,
  getRoadmap,
  patchRoadmapTask,
  getCourses,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/student-portal.controller.js";

const router = Router();

router.use(authenticate, authorize("student"));

router.get("/dashboard", getDashboard);

router.get("/jobs/recommended", listRecommended);
router.get("/jobs", listJobs);
router.get("/jobs/:jobId/match-score", getMatchScore);
router.get("/jobs/:jobId", getJob);
router.post("/jobs/:jobId/apply", applyToJob);

router.get("/applications", listApplications);

router.get("/profile", getStudentProfile);
router.patch("/profile", patchStudentProfile);
router.post(
  "/resume",
  resumeUpload.single("resume"),
  postResumeUpload,
);
router.post("/resume/parse", postParseResume);

router.get("/content/quiz", getQuiz);
router.get("/content/roadmap", getRoadmap);
router.patch("/content/roadmap/tasks/:taskId", patchRoadmapTask);
router.get("/content/courses", getCourses);

router.get("/notifications", listNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.post("/notifications/read-all", markAllNotificationsRead);

export default router;
