import { type BotReply, type NewBotReply, type NewChatFeedback } from '../db/schema/bot-replies.js';
export declare class BotReplyRepository {
    findAll(): Promise<BotReply[]>;
    findByKeyword(keyword: string): Promise<BotReply[]>;
    findByKeywords(keywords: string[]): Promise<BotReply[]>;
    create(data: NewBotReply): Promise<BotReply>;
    update(id: number, data: Partial<NewBotReply>): Promise<BotReply | undefined>;
    delete(id: number): Promise<BotReply | undefined>;
}
export declare class ChatFeedbackRepository {
    create(data: NewChatFeedback): Promise<{
        id: number;
    }>;
}
//# sourceMappingURL=bot.repository.d.ts.map