import { sendError, sendSuccess } from "../utils/response.utils.js";
import { publicMentorParamsSchema, publicMentorsListQuerySchema, } from "../validators/public-mentors.validator.js";
import { publicMentorsService } from "../services/public-mentors.service.js";
export const listPublicMentors = async (req, res) => {
    try {
        const parsed = publicMentorsListQuerySchema.safeParse(req.query);
        const raw = parsed.success
            ? parsed.data
            : {
                page: 1,
                limit: 20,
                expertise: undefined,
                sort: "updatedAt",
                order: "desc",
            };
        const query = {
            page: raw.page,
            limit: raw.limit,
            sort: raw.sort,
            order: raw.order,
            ...(raw.q ? { q: raw.q } : {}),
            ...(raw.expertise && raw.expertise.length > 0
                ? { expertise: raw.expertise }
                : {}),
        };
        const data = await publicMentorsService.list(query);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error("List public mentors error:", error);
        sendError(res, 500, "Failed to list mentors");
    }
};
export const getPublicMentor = async (req, res) => {
    try {
        const parsed = publicMentorParamsSchema.safeParse(req.params);
        if (!parsed.success) {
            sendError(res, 400, "Invalid mentor id", parsed.error.flatten().fieldErrors);
            return;
        }
        const data = await publicMentorsService.getById(parsed.data.mentorId);
        if (!data) {
            sendError(res, 404, "Mentor not found");
            return;
        }
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error("Get public mentor error:", error);
        sendError(res, 500, "Failed to load mentor");
    }
};
//# sourceMappingURL=public-mentors.controller.js.map