import { Router } from "express";
import {
  getPublicRecruiter,
  listPublicRecruiters,
} from "../controllers/public-recruiters.controller.js";

const router = Router();

// Public: list non-sensitive recruiter profile cards
router.get("/", listPublicRecruiters);

// Public: fetch one non-sensitive recruiter profile
router.get("/:recruiterId", getPublicRecruiter);

export default router;
