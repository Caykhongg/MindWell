import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
export function reportController(reportService) {
    return {
        create: asyncHandler(async (req, res) => {
            const { postId, reason } = req.body;
            const report = await reportService.create(req.userId, { postId, reason });
            res.status(201).json(success(report));
        }),
        list: asyncHandler(async (_req, res) => {
            const all = await reportService.list();
            res.json(success(all));
        }),
        resolve: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const result = await reportService.resolve(id);
            res.json(success(result));
        }),
    };
}
//# sourceMappingURL=report.controller.js.map