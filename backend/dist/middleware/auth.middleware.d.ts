import type { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: number;
    userRole?: string;
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void;
export declare function requireRole(...roles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map