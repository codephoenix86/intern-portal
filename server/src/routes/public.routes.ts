import { Router } from "express";
import { getPublicJob, listPublicJobs } from "../controllers/public-portal.controller.js";

const router = Router();

router.get("/jobs", listPublicJobs);
router.get("/jobs/:jobId", getPublicJob);

export default router;
