import { Router } from "express";
import { listPublicStudents } from "../controllers/public-students.controller.js";
const router = Router();
// Public: list non-sensitive student profile cards
router.get("/", listPublicStudents);
export default router;
//# sourceMappingURL=public-students.routes.js.map