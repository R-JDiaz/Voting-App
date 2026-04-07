export default class AppError extends Error {
    constructor(message, status=400, code) {
        super(message);
        this.code = code;
        this.status = status;
    }
}