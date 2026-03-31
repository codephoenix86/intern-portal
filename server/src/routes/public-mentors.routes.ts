import { Router } from "express";
import {
  getPublicMentor,
  listPublicMentors,
} from "../controllers/public-mentors.controller.js";

const router = Router();

// Public: list non-sensitive mentor profile cards
router.get("/", listPublicMentors);

// Public: fetch one non-sensitive mentor profile
router.get("/:mentorId", getPublicMentor);

export default router;
