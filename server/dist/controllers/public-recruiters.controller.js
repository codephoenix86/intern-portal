import { sendError, sendSuccess } from "../utils/response.utils.js";
import { publicRecruiterParamsSchema, publicRecruitersListQuerySchema, } from "../validators/public-recruiters.validator.js";
import { publicRecruitersService } from "../services/public-recruiters.service.js";
export const listPublicRecruiters = async (req, res) => {
    try {
        const parsed = publicRecruitersListQuerySchema.safeParse(req.query);
        const raw = parsed.success
            ? parsed.data
            : {
                page: 1,
                limit: 20,
                sort: "updatedAt",
                order: "desc",
            };
        const query = {
            page: raw.page,
            limit: raw.limit,
            sort: raw.sort,
            order: raw.order,
            ...(raw.q ? { q: raw.q } : {}),
            ...(raw.company ? { company: raw.company } : {}),
            ...(raw.location ? { location: raw.location } : {}),
        };
        const data = await publicRecruitersService.list(query);
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error("List public recruiters error:", error);
        sendError(res, 500, "Failed to list recruiters");
    }
};
export const getPublicRecruiter = async (req, res) => {
    try {
        const parsed = publicRecruiterParamsSchema.safeParse(req.params);
        if (!parsed.success) {
            sendError(res, 400, "Invalid recruiter id", parsed.error.flatten().fieldErrors);
            return;
        }
        const data = await publicRecruitersService.getById(parsed.data.recruiterId);
        if (!data) {
            sendError(res, 404, "Recruiter not found");
            return;
        }
        sendSuccess(res, 200, "OK", data);
    }
    catch (error) {
        console.error("Get public recruiter error:", error);
        sendError(res, 500, "Failed to load recruiter");
    }
};
//# sourceMappingURL=public-recruiters.controller.js.map