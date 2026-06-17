import { type Message, type NewMessage } from '../db/schema/conversations.js';
export declare class MessageRepository {
    create(data: NewMessage): Promise<Message>;
    findByConversationId(conversationId: number, cursor?: number, limit?: number): Promise<{
        entries: Message[];
        hasMore: boolean;
    }>;
    findById(id: number): Promise<Message | undefined>;
    findUnreadCount(conversationId: number, userId: number): Promise<number>;
}
//# sourceMappingURL=message.repository.d.ts.map