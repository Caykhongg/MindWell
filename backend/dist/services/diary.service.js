import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
export class DiaryService {
    diaryRepo;
    constructor(diaryRepo) {
        this.diaryRepo = diaryRepo;
    }
    async getEntries(userId, page, limit) {
        const { entries, total } = await this.diaryRepo.findByUserId(userId, page, limit);
        return { entries, total };
    }
    async getEntry(id, userId) {
        const entry = await this.diaryRepo.findById(id);
        if (!entry) {
            throw new NotFoundError('nhật ký');
        }
        if (entry.userId !== userId) {
            throw new ForbiddenError('Bạn không có quyền xem nhật ký này');
        }
        return entry;
    }
    async createEntry(userId, data) {
        const tags = data.tags?.join(',') ?? null;
        const entry = await this.diaryRepo.create({
            userId,
            content: data.content,
            mood: data.mood,
            tags,
        });
        logger.info({ diaryEntryId: entry.id, userId }, 'Diary entry created');
        return entry;
    }
    async updateEntry(id, userId, data) {
        const entry = await this.diaryRepo.findById(id);
        if (!entry) {
            throw new NotFoundError('nhật ký');
        }
        if (entry.userId !== userId) {
            throw new ForbiddenError('Bạn không có quyền sửa nhật ký này');
        }
        const updateData = { ...data, tags: data.tags ? data.tags.join(',') : data.tags };
        const updated = await this.diaryRepo.update(id, updateData);
        return updated;
    }
    async deleteEntry(id, userId) {
        const entry = await this.diaryRepo.findById(id);
        if (!entry) {
            throw new NotFoundError('nhật ký');
        }
        if (entry.userId !== userId) {
            throw new ForbiddenError('Bạn không có quyền xoá nhật ký này');
        }
        await this.diaryRepo.delete(id);
        logger.info({ diaryEntryId: id, userId }, 'Diary entry deleted');
    }
}
//# sourceMappingURL=diary.service.js.map