import { liveSessionService } from "../services/live-session.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";
import { availableSessionsQuerySchema } from "../validators/live-session.validator.js";
// GET /api/sessions/available
export const getAvailableSessions = async (req, res) => {
    try {
        if (!req.user) {
            sendError(res, 401, "Authentication required");
            return;
        }
        const queryResult = availableSessionsQuerySchema.safeParse(req.query);
        const query = queryResult.success
            ? queryResult.data
            : { page: 1, limit: 20, type: "all" };
        const result = await liveSessionService.getAvailableSessionsForStudents(query);
        sendSuccess(res, 200, "Sessions fetched successfully", result);
    }
    catch (error) {
        console.error("Get available sessions error:", error);
        sendError(res, 500, "Failed to fetch sessions");
    }
};
//# sourceMappingURL=student.controller.js.map