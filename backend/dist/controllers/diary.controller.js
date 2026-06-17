import { asyncHandler } from '../middleware/async-handler.js';
import { success, paginated } from '../utils/response.js';
function splitTags(entry) {
    return {
        ...entry,
        tags: entry.tags?.split(',').filter(Boolean) ?? [],
    };
}
export function diaryController(diaryService) {
    return {
        list: asyncHandler(async (req, res) => {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const { entries, total } = await diaryService.getEntries(req.userId, page, limit);
            const mapped = entries.map(splitTags);
            res.json(paginated(mapped, total, page, limit));
        }),
        getById: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const entry = await diaryService.getEntry(id, req.userId);
            res.json(success(splitTags(entry)));
        }),
        create: asyncHandler(async (req, res) => {
            const { content, mood, tags } = req.body;
            const entry = await diaryService.createEntry(req.userId, { content, mood, tags });
            res.status(201).json(success(splitTags(entry)));
        }),
        update: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const { content, mood, tags } = req.body;
            const entry = await diaryService.updateEntry(id, req.userId, { content, mood, tags });
            res.json(success(splitTags(entry)));
        }),
        delete: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            await diaryService.deleteEntry(id, req.userId);
            res.json(success({ message: 'Xoá nhật ký thành công' }));
        }),
    };
}
//# sourceMappingURL=diary.controller.js.map