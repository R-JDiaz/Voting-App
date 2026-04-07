export default class AppError extends Error {
    constructor(message, status=400, code, errors) {
        super(message);
        this.code = code;
        this.status = status;
        this.errors = errors;
    }
}

export const successResponse = (data, message = "OK", meta = {}) => {
    return {
        success: true,
        message,
        data,
        ...meta
    };
};