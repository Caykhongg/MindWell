import { UserRepository } from '../repositories/user.repository.js';
export declare class AuthService {
    private userRepo;
    constructor(userRepo: UserRepository);
    register(name: string, email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            isActive: boolean;
            avatarUrl: string | null;
            phone: string | null;
            mfaEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            isActive: boolean;
            avatarUrl: string | null;
            phone: string | null;
            mfaEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
        };
    }>;
    logout(userId: number): Promise<void>;
    refreshToken(refreshTokenStr: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            isActive: boolean;
            avatarUrl: string | null;
            phone: string | null;
            mfaEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        isActive: boolean;
        avatarUrl: string | null;
        phone: string | null;
        mfaEnabled: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    updateProfile(userId: number, data: {
        name?: string;
        phone?: string;
        avatarUrl?: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        isActive: boolean;
        avatarUrl: string | null;
        phone: string | null;
        mfaEnabled: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    private generateTokens;
    private sanitizeUser;
}
//# sourceMappingURL=auth.service.d.ts.map