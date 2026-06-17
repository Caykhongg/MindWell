import type { Response } from 'express';
import { ReportService } from '../services/report.service.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

export function reportController(reportService: ReportService) {
  return {
    create: asyncHandler(async (req: AuthRequest, res: Response) => {
      const { postId, reason } = req.body;
      const report = await reportService.create(req.userId!, { postId, reason });
      res.status(201).json(success(report));
    }),

    list: asyncHandler(async (_req: AuthRequest, res: Response) => {
      const all = await reportService.list();
      res.json(success(all));
    }),

    resolve: asyncHandler(async (req: AuthRequest, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      const { action } = req.body;
      const result = await reportService.resolve(id, action || 'dismiss');
      res.json(success(result));
    }),
  };
}
