import type { Response } from 'express';
import { TestService } from '../services/test.service.js';
export declare function testController(testService: TestService): {
    list: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=test.controller.d.ts.map