import { sendError } from "../utils/response.utils.js";
/**
 * Middleware to validate request body against a Zod schema
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = {};
            for (const issue of result.error.issues) {
                const field = issue.path.join(".");
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field].push(issue.message);
            }
            sendError(res, 400, "Validation failed", errors);
            return;
        }
        // Replace body with parsed & validated data
        req.body = result.data;
        next();
    };
};
//# sourceMappingURL=validate.middleware.js.map