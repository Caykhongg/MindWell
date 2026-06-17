import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
import { config } from '../config/index.js';
export function authController(authService) {
    const COOKIE_OPTIONS_ACCESS = {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
        path: '/',
    };
    const COOKIE_OPTIONS_REFRESH = {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
    };
    const setTokenCookies = (res, accessToken, refreshToken) => {
        res.cookie('accessToken', accessToken, COOKIE_OPTIONS_ACCESS);
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS_REFRESH);
    };
    const clearTokenCookies = (res) => {
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    };
    return {
        register: asyncHandler(async (req, res) => {
            const { name, email, password } = req.body;
            const result = await authService.register(name, email, password);
            setTokenCookies(res, result.accessToken, result.refreshToken);
            res.status(201).json(success({ user: result.user }));
        }),
        login: asyncHandler(async (req, res) => {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            setTokenCookies(res, result.accessToken, result.refreshToken);
            res.json(success({ user: result.user }));
        }),
        logout: asyncHandler(async (req, res) => {
            if (req.userId) {
                await authService.logout(req.userId);
            }
            clearTokenCookies(res);
            res.json(success({ message: 'Đăng xuất thành công' }));
        }),
        refresh: asyncHandler(async (req, res) => {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập' },
                });
            }
            const result = await authService.refreshToken(refreshToken);
            setTokenCookies(res, result.accessToken, result.refreshToken);
            res.json(success({ user: result.user }));
        }),
        getProfile: asyncHandler(async (req, res) => {
            const user = await authService.getProfile(req.userId);
            res.json(success({ user }));
        }),
        updateProfile: asyncHandler(async (req, res) => {
            const { name, phone, avatarUrl } = req.body;
            const user = await authService.updateProfile(req.userId, { name, phone, avatarUrl });
            res.json(success({ user }));
        }),
        changePassword: asyncHandler(async (req, res) => {
            const { currentPassword, newPassword } = req.body;
            await authService.changePassword(req.userId, currentPassword, newPassword);
            res.json(success({ message: 'Đổi mật khẩu thành công' }));
        }),
        forgotPassword: asyncHandler(async (req, res) => {
            const { email } = req.body;
            await authService.forgotPassword(email);
            res.json(success({ message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu' }));
        }),
        resetPassword: asyncHandler(async (req, res) => {
            const token = String(req.params.token);
            const { password } = req.body;
            await authService.resetPassword(token, password);
            res.json(success({ message: 'Mật khẩu đã được đặt lại thành công' }));
        }),
    };
}
//# sourceMappingURL=auth.controller.js.map