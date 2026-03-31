export const sendSuccess = (res, statusCode, message, data) => {
    const response = {
        success: true,
        message,
    };
    if (data !== undefined) {
        response.data = data;
    }
    res.status(statusCode).json(response);
};
export const sendError = (res, statusCode, message, errors) => {
    const response = {
        success: false,
        message,
    };
    if (errors) {
        response.errors = errors;
    }
    res.status(statusCode).json(response);
};
//# sourceMappingURL=response.utils.js.map