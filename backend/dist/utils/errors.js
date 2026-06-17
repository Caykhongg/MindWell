export class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'AppError';
    }
}
export class NotFoundError extends AppError {
    constructor(resource) {
        super(404, 'NOT_FOUND', `Không tìm thấy ${resource}`);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Vui lòng đăng nhập') {
        super(401, 'UNAUTHORIZED', message);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Không có quyền thực hiện hành động này') {
        super(403, 'FORBIDDEN', message);
    }
}
export class ValidationError extends AppError {
    constructor(details) {
        super(400, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ', details);
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(409, 'CONFLICT', message);
    }
}
//# sourceMappingURL=errors.js.map