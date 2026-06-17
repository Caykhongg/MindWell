import type { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
export declare function authController(authService: AuthService): {
    register: (req: import("express").Request, res: Response, next: NextFunction) => void;
    login: (req: import("express").Request, res: Response, next: NextFunction) => void;
    logout: (req: import("express").Request, res: Response, next: NextFunction) => void;
    refresh: (req: import("express").Request, res: Response, next: NextFunction) => void;
    getProfile: (req: import("express").Request, res: Response, next: NextFunction) => void;
    updateProfile: (req: import("express").Request, res: Response, next: NextFunction) => void;
    changePassword: (req: import("express").Request, res: Response, next: NextFunction) => void;
    forgotPassword: (req: import("express").Request, res: Response, next: NextFunction) => void;
    resetPassword: (req: import("express").Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=auth.controller.d.ts.map