import { sendError, sendSuccess } from "../utils/response.utils.js";
import { publicStudentsListQuerySchema } from "../validators/public-students.validator.js";
import { publicStudentsService } from "../services/public-students.service.js";
export const listPublicStudents = async (req, res) => {
    try {
        const parsed = publicStudentsListQuerySchema.safeParse(req.query);
        const raw = parsed.success
            ? parsed.data
            : {
                page: 1,
                limit: 20,
                skills: undefined,
                sort: "updatedAt",
                order: "desc",
            };
        const query = {
            page: raw.page,
            limit: raw.limit,
            sort: raw.sort,
            order: raw.order,
            ...(raw.q ? { q: raw.q } : {}),
            ...(raw.college ? { college: raw.college } : {}),
            ...(raw.branch ? { branch: raw.branch } : {}),
            ...(raw.location ? { location: raw.location } : {}),
            ...(raw.skills && raw.skills.length > 0 ? { skills: raw.skills } : {}),
        };
        const data = await publicStudentsService.list(query);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error("List public students error:", error);
        sendError(res, 500, "Failed to list students");
    }
};
//# sourceMappingURL=public-students.controller.js.map