import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  getDashboard,
  listJobs,
  getJob,
  postJob,
  patchJob,
  closeJob,
  listApplicants,
  patchApplication,
  getProfile,
  patchProfile,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/recruiter-portal.controller.js";

const router = Router();

router.use(authenticate, authorize("recruiter"));

router.get("/dashboard", getDashboard);

router.get("/jobs", listJobs);
router.get("/jobs/:jobId", getJob);
router.post("/jobs", postJob);
router.patch("/jobs/:jobId", patchJob);
router.patch("/jobs/:jobId/close", closeJob);

router.get("/applicants", listApplicants);
router.patch("/applications/:applicationId", patchApplication);

router.get("/profile", getProfile);
router.patch("/profile", patchProfile);

router.get("/notifications", listNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.post("/notifications/read-all", markAllNotificationsRead);

export default router;
