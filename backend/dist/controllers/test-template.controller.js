import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
export function testTemplateController(service) {
    return {
        list: asyncHandler(async (_req, res) => {
            const templates = await service.list();
            res.json(success(templates));
        }),
        getById: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const template = await service.getById(id);
            res.json(success(template));
        }),
        create: asyncHandler(async (req, res) => {
            const { title, description, options } = req.body;
            const questions = options?.questions || [];
            const template = await service.create(req.userId, { title, description, questions });
            res.status(201).json(success(template));
        }),
        update: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const { title, description, options } = req.body;
            const questions = options?.questions;
            const template = await service.update(id, req.userId, req.userRole, { title, description, questions });
            res.json(success(template));
        }),
        delete: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            await service.delete(id, req.userId, req.userRole);
            res.json(success({ message: 'Đã xóa bài kiểm tra' }));
        }),
    };
}
//# sourceMappingURL=test-template.controller.js.map