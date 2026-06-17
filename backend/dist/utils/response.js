export function success(data, meta) {
    return { success: true, data, ...(meta ? { meta } : {}) };
}
export function paginated(data, total, page, limit) {
    return {
        success: true,
        data,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}
export function errorResponse(code, message, details) {
    return {
        success: false,
        error: { code, message, ...(details ? { details } : {}) },
    };
}
//# sourceMappingURL=response.js.map