import { ConversationRepository } from '../repositories/conversation.repository.js';
import { MessageRepository } from '../repositories/message.repository.js';
export declare class ChatService {
    private conversationRepo;
    private messageRepo;
    constructor(conversationRepo: ConversationRepository, messageRepo: MessageRepository);
    createConversation(creatorId: number, contactId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
    } | {
        conversation: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        participants: {
            id: number;
            userId: number;
            conversationId: number;
            joinedAt: Date;
            lastReadAt: Date;
        }[];
        lastMessage: null;
    }>;
    getConversations(userId: number): Promise<{
        conversation: import("../db/schema/conversations.js").Conversation;
        lastMessage: unknown;
        participants: {
            id: number;
            name: string;
            email: string;
            role: string;
            avatarUrl: string | null;
        }[];
    }[]>;
    getConversationDetail(id: number, userId: number): Promise<{
        conversation: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        participants: {
            id: number;
            userId: number;
            conversationId: number;
            joinedAt: Date;
            lastReadAt: Date;
        }[];
    }>;
    getMessages(conversationId: number, userId: number, cursor?: number): Promise<{
        entries: import("../db/schema/conversations.js").Message[];
        hasMore: boolean;
    }>;
    sendMessage(conversationId: number, senderId: number, text: string): Promise<{
        id: number;
        createdAt: Date;
        isRead: number;
        conversationId: number;
        senderId: number;
        text: string;
    }>;
    markAsRead(conversationId: number, userId: number, messageIds: number[]): Promise<void>;
}
//# sourceMappingURL=chat.service.d.ts.map