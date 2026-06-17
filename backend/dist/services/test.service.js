import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
function calculateScore(testType, answers) {
    const total = answers.reduce((sum, v) => sum + v, 0);
    if (testType === 'phq9') {
        if (total <= 4)
            return { score: total, result: 'normal' };
        if (total <= 9)
            return { score: total, result: 'mild' };
        if (total <= 14)
            return { score: total, result: 'moderate' };
        return { score: total, result: 'severe' };
    }
    if (testType === 'gad7') {
        if (total <= 4)
            return { score: total, result: 'normal' };
        if (total <= 9)
            return { score: total, result: 'mild' };
        if (total <= 14)
            return { score: total, result: 'moderate' };
        return { score: total, result: 'severe' };
    }
    const maxScore = answers.length * 3;
    const pct = (total / maxScore) * 100;
    if (pct <= 20)
        return { score: total, result: 'normal' };
    if (pct <= 40)
        return { score: total, result: 'mild' };
    if (pct <= 60)
        return { score: total, result: 'moderate' };
    return { score: total, result: 'severe' };
}
export class TestService {
    testRepo;
    constructor(testRepo) {
        this.testRepo = testRepo;
    }
    async getEntries(userId, page, limit) {
        const { entries, total } = await this.testRepo.findByUserId(userId, page, limit);
        const data = entries.map((e) => ({ ...e, answers: JSON.parse(e.answers) }));
        return { entries: data, total };
    }
    async getEntry(id, userId) {
        const entry = await this.testRepo.findById(id);
        if (!entry) {
            throw new NotFoundError('bài kiểm tra');
        }
        if (entry.userId !== userId) {
            throw new ForbiddenError('Bạn không có quyền xem bài kiểm tra này');
        }
        return { ...entry, answers: JSON.parse(entry.answers) };
    }
    async createEntry(userId, data) {
        const { score, result } = calculateScore(data.testType, data.answers);
        const entry = await this.testRepo.create({
            userId,
            score,
            result,
            answers: JSON.stringify(data.answers),
            testType: data.testType,
        });
        logger.info({ testId: entry.id, userId, testType: data.testType, score }, 'Mental test submitted');
        return { ...entry, answers: data.answers };
    }
}
//# sourceMappingURL=test.service.js.map