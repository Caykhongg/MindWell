import type { Response } from 'express';
import { ReportService } from '../services/report.service.js';
export declare function reportController(reportService: ReportService): {
    create: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    list: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    resolve: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=report.controller.d.ts.map