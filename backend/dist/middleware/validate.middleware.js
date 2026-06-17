import { errorResponse } from '../utils/response.js';
export function validate(schema, source = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Dữ liệu không hợp lệ', result.error.issues.map((i) => ({
                field: i.path.join('.'),
                message: i.message,
            }))));
        }
        req[source] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map