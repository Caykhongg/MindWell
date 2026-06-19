import { NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { trace } from '../utils/tracing.js';
const CRISIS_KEYWORDS = [
    'tự tử', 'tự sát', 'khủng hoảng', 'muốn chết',
    'kết thúc cuộc đời', 'đau khổ quá', 'không muốn sống nữa',
];
const CRISIS_RESPONSE = `Tôi rất quan tâm đến bạn. Nếu bạn đang gặp khủng hoảng, hãy liên hệ ngay:
• Trung tâm hỗ trợ tâm lý: 1900 599 933
• Đường dây nóng TPHCM: (028) 3899 6099
• Hotline Bộ Y tế: 1900 3228
Bạn không cô đơn, hãy nói chuyện với người thân hoặc chuyên gia tâm lý ngay nhé.`;
const DEFAULT_REPLIES = [
    'Cảm ơn bạn đã chia sẻ. Hãy cho mình biết thêm để mình có thể giúp đỡ bạn tốt hơn nhé.',
    'Mình hiểu cảm giác của bạn. Bạn có muốn nói thêm về điều đó không?',
    'Mình luôn sẵn sàng lắng nghe bạn. Hãy kể mình nghe thêm nhé.',
    'Cảm ơn bạn đã tin tưởng và chia sẻ. Mình hy vọng bạn sẽ luôn khỏe mạnh và bình an.',
];
export class BotService {
    botReplyRepo;
    feedbackRepo;
    constructor(botReplyRepo, feedbackRepo) {
        this.botReplyRepo = botReplyRepo;
        this.feedbackRepo = feedbackRepo;
    }
    chat = trace(async (message, userId) => {
        const lowerMsg = message.toLowerCase();
        for (const keyword of CRISIS_KEYWORDS) {
            if (lowerMsg.includes(keyword)) {
                logger.info({ userId, keyword }, 'Crisis keyword detected in chat');
                return { reply: CRISIS_RESPONSE, isCrisis: true, matchedKeyword: keyword };
            }
        }
        const words = lowerMsg.split(/\s+/).filter(w => w.length >= 2);
        if (words.length > 0) {
            const results = await this.botReplyRepo.findByKeywords(words);
            const matchedReplies = results.flatMap(r => ({ reply: r.reply, keyword: r.keywords }));
            if (matchedReplies.length > 0) {
                const selected = matchedReplies[Math.floor(Math.random() * matchedReplies.length)];
                return { reply: selected.reply, isCrisis: false, matchedKeyword: selected.keyword };
            }
        }
        const fallback = DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)];
        return { reply: fallback, isCrisis: false };
    }, { name: 'BotService.chat' });
    async submitFeedback(data, userId) {
        const result = await this.feedbackRepo.create({
            messageText: data.messageText,
            botReply: data.botReply,
            helpful: data.helpful,
            keywords: data.keywords || null,
            userId,
        });
        logger.info({ feedbackId: result.id, userId, helpful: data.helpful }, 'Feedback submitted');
        return result;
    }
    async listReplies() {
        return this.botReplyRepo.findAll();
    }
    async createReply(data) {
        const result = await this.botReplyRepo.create(data);
        logger.info({ replyId: result.id }, 'Bot reply rule created');
        return result;
    }
    async updateReply(id, data) {
        const existing = await this.botReplyRepo.update(id, data);
        if (!existing)
            throw new NotFoundError('quy tắc bot');
        logger.info({ replyId: id }, 'Bot reply rule updated');
        return existing;
    }
    async deleteReply(id) {
        const existing = await this.botReplyRepo.delete(id);
        if (!existing)
            throw new NotFoundError('quy tắc bot');
        logger.info({ replyId: id }, 'Bot reply rule deleted');
        return existing;
    }
}
//# sourceMappingURL=bot.service.js.map