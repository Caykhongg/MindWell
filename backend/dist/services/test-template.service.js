import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
export class TestTemplateService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async list() {
        return this.repo.findAll();
    }
    async getById(id) {
        const template = await this.repo.findById(id);
        if (!template)
            throw new NotFoundError('bài kiểm tra');
        return template;
    }
    async create(userId, data) {
        const template = await this.repo.create({
            title: data.title,
            description: data.description || '',
            createdBy: userId,
        }, data.questions);
        logger.info({ templateId: template?.id, userId }, 'Test template created');
        return template;
    }
    async update(id, userId, role, data) {
        const template = await this.repo.findById(id);
        if (!template)
            throw new NotFoundError('bài kiểm tra');
        if (template.createdBy !== userId && role !== 'admin') {
            throw new ForbiddenError('Bạn không có quyền sửa bài kiểm tra này');
        }
        return this.repo.update(id, data, data.questions);
    }
    async delete(id, userId, role) {
        const template = await this.repo.findById(id);
        if (!template)
            throw new NotFoundError('bài kiểm tra');
        if (template.createdBy !== userId && role !== 'admin') {
            throw new ForbiddenError('Bạn không có quyền xóa bài kiểm tra này');
        }
        await this.repo.delete(id);
    }
}
//# sourceMappingURL=test-template.service.js.map