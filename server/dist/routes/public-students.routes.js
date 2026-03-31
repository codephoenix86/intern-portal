import { Router } from "express";
import { getPublicStudent, listPublicStudents, } from "../controllers/public-students.controller.js";
const router = Router();
// Public: list non-sensitive student profile cards
router.get("/", listPublicStudents);
// Public: fetch one non-sensitive student profile
router.get("/:studentId", getPublicStudent);
export default router;
//# sourceMappingURL=public-students.routes.js.map