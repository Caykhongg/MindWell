import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { errorResponse } from '../utils/response.js';
export function authenticate(req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token) {
        return res.status(401).json(errorResponse('UNAUTHORIZED', 'Vui lòng đăng nhập'));
    }
    try {
        const decoded = jwt.verify(token, config.jwt.accessSecret);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    }
    catch {
        return res.status(401).json(errorResponse('TOKEN_EXPIRED', 'Token hết hạn, vui lòng đăng nhập lại'));
    }
}
export function optionalAuth(req, _res, next) {
    const token = req.cookies?.accessToken;
    if (!token)
        return next();
    try {
        const decoded = jwt.verify(token, config.jwt.accessSecret);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
    }
    catch {
        // Token invalid, continue without auth
    }
    next();
}
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).json(errorResponse('FORBIDDEN', 'Không có quyền thực hiện hành động này'));
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map