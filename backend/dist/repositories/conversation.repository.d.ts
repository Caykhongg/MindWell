import { type Conversation, type NewConversation, type ConversationParticipant, type NewConversationParticipant } from '../db/schema/conversations.js';
export declare class ConversationRepository {
    create(data: NewConversation): Promise<Conversation>;
    findById(id: number): Promise<Conversation | undefined>;
    findExistingPrivateConversation(userId: number, contactId: number): Promise<Conversation | undefined>;
    findByUserId(userId: number): Promise<{
        conversation: Conversation;
        lastMessage: unknown;
        participants: {
            id: number;
            name: string;
            email: string;
            role: string;
            avatarUrl: string | null;
        }[];
    }[]>;
    updateTimestamp(id: number): Promise<void>;
    addParticipant(data: NewConversationParticipant): Promise<ConversationParticipant>;
    addParticipants(data: NewConversationParticipant[]): Promise<ConversationParticipant[]>;
    findParticipants(conversationId: number): Promise<ConversationParticipant[]>;
    isParticipant(conversationId: number, userId: number): Promise<boolean>;
    markAsRead(conversationId: number, userId: number, messageIds: number[]): Promise<void>;
}
//# sourceMappingURL=conversation.repository.d.ts.map