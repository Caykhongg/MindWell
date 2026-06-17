import { BotReplyRepository, ChatFeedbackRepository } from '../repositories/bot.repository.js';
export declare class BotService {
    private botReplyRepo;
    private feedbackRepo;
    constructor(botReplyRepo: BotReplyRepository, feedbackRepo: ChatFeedbackRepository);
    chat(message: string, userId?: number): Promise<{
        reply: string;
        isCrisis: boolean;
        matchedKeyword: string;
    } | {
        reply: string;
        isCrisis: boolean;
        matchedKeyword?: undefined;
    }>;
    submitFeedback(data: {
        messageText: string;
        botReply: string;
        helpful: number;
        keywords?: string;
    }, userId: number): Promise<{
        id: number;
    }>;
    listReplies(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        keywords: string;
        reply: string;
    }[]>;
    createReply(data: {
        keywords: string;
        reply: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        keywords: string;
        reply: string;
    }>;
    updateReply(id: number, data: {
        keywords?: string;
        reply?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        keywords: string;
        reply: string;
    }>;
    deleteReply(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        keywords: string;
        reply: string;
    }>;
}
//# sourceMappingURL=bot.service.d.ts.map