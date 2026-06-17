import { asyncHandler } from '../middleware/async-handler.js';
import { success, paginated } from '../utils/response.js';
export function testController(testService) {
    return {
        list: asyncHandler(async (req, res) => {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const { entries, total } = await testService.getEntries(req.userId, page, limit);
            res.json(paginated(entries, total, page, limit));
        }),
        getById: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const entry = await testService.getEntry(id, req.userId);
            res.json(success(entry));
        }),
        create: asyncHandler(async (req, res) => {
            const { answers, testType } = req.body;
            const entry = await testService.createEntry(req.userId, { answers, testType });
            res.status(201).json(success(entry));
        }),
    };
}
//# sourceMappingURL=test.controller.js.map