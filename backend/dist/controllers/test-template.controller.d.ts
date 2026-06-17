import type { Response } from 'express';
import { TestTemplateService } from '../services/test-template.service.js';
export declare function testTemplateController(service: TestTemplateService): {
    list: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=test-template.controller.d.ts.map