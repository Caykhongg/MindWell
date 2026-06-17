import type { Response } from 'express';
import { DiaryService } from '../services/diary.service.js';
export declare function diaryController(diaryService: DiaryService): {
    list: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=diary.controller.d.ts.map