import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';
export class AuthService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async register(name, email, password) {
        const existing = await this.userRepo.findByEmail(email);
        if (existing) {
            throw new ConflictError('Email đã được đăng ký');
        }
        const passwordHash = await bcrypt.hash(password, config.bcrypt.rounds);
        const user = await this.userRepo.create({
            name,
            email,
            passwordHash,
        });
        const tokens = this.generateTokens(user.id, user.role);
        await this.userRepo.update(user.id, { refreshToken: tokens.refreshToken });
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
        }
        if (!user.isActive) {
            throw new UnauthorizedError('Tài khoản đã bị vô hiệu hóa');
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
        }
        const tokens = this.generateTokens(user.id, user.role);
        await this.userRepo.update(user.id, {
            refreshToken: tokens.refreshToken,
            lastLoginAt: new Date(),
        });
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async logout(userId) {
        await this.userRepo.update(userId, { refreshToken: null });
    }
    async refreshToken(refreshTokenStr) {
        let decoded;
        try {
            decoded = jwt.verify(refreshTokenStr, config.jwt.refreshSecret);
        }
        catch {
            throw new UnauthorizedError('Refresh token không hợp lệ hoặc đã hết hạn');
        }
        const user = await this.userRepo.findById(decoded.userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedError('Tài khoản không tồn tại hoặc đã bị vô hiệu hóa');
        }
        if (user.refreshToken !== refreshTokenStr) {
            await this.userRepo.update(user.id, { refreshToken: null });
            throw new UnauthorizedError('Refresh token đã được sử dụng, vui lòng đăng nhập lại');
        }
        const tokens = this.generateTokens(user.id, user.role);
        await this.userRepo.update(user.id, { refreshToken: tokens.refreshToken });
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async getProfile(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new NotFoundError('người dùng');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, data) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new NotFoundError('người dùng');
        }
        const updated = await this.userRepo.update(userId, data);
        return this.sanitizeUser(updated);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new NotFoundError('người dùng');
        }
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) {
            throw new UnauthorizedError('Mật khẩu hiện tại không đúng');
        }
        const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.rounds);
        await this.userRepo.update(userId, { passwordHash });
    }
    async forgotPassword(email) {
        const user = await this.userRepo.findByEmail(email);
        if (!user)
            return;
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.userRepo.update(user.id, {
            passwordResetToken: resetToken,
            passwordResetExpires: resetExpires,
        });
    }
    async resetPassword(token, newPassword) {
        const user = await this.userRepo.findByResetToken(token);
        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            throw new UnauthorizedError('Token không hợp lệ hoặc đã hết hạn');
        }
        const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.rounds);
        await this.userRepo.update(user.id, {
            passwordHash,
            passwordResetToken: null,
            passwordResetExpires: null,
        });
    }
    generateTokens(userId, role) {
        const accessToken = jwt.sign({ userId, role }, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
        const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
        return { accessToken, refreshToken };
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            avatarUrl: user.avatarUrl,
            phone: user.phone,
            mfaEnabled: user.mfaEnabled,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        };
    }
}
//# sourceMappingURL=auth.service.js.map