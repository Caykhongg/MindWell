import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { getRoomManager } from '../websocket/registry.js';
import { trace } from '../utils/tracing.js';
export class ChatService {
    conversationRepo;
    messageRepo;
    constructor(conversationRepo, messageRepo) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
    }
    async createConversation(creatorId, contactId) {
        const existing = await this.conversationRepo.findExistingPrivateConversation(creatorId, contactId);
        if (existing)
            return existing;
        const conversation = await this.conversationRepo.create({});
        await this.conversationRepo.addParticipants([
            { conversationId: conversation.id, userId: creatorId, joinedAt: new Date(), lastReadAt: new Date() },
            { conversationId: conversation.id, userId: contactId, joinedAt: new Date(), lastReadAt: new Date() },
        ]);
        logger.info({ conversationId: conversation.id, creatorId, contactId }, 'Conversation created');
        const participants = await this.conversationRepo.findParticipants(conversation.id);
        return { conversation, participants, lastMessage: null };
    }
    async getConversations(userId) {
        return this.conversationRepo.findByUserId(userId);
    }
    async getConversationDetail(id, userId) {
        const conversation = await this.conversationRepo.findById(id);
        if (!conversation)
            throw new NotFoundError('cuộc trò chuyện');
        const isParticipant = await this.conversationRepo.isParticipant(id, userId);
        if (!isParticipant)
            throw new ForbiddenError('Bạn không phải thành viên của cuộc trò chuyện này');
        const participants = await this.conversationRepo.findParticipants(id);
        return { conversation, participants };
    }
    async getMessages(conversationId, userId, cursor) {
        const isParticipant = await this.conversationRepo.isParticipant(conversationId, userId);
        if (!isParticipant)
            throw new ForbiddenError('Bạn không phải thành viên của cuộc trò chuyện này');
        return this.messageRepo.findByConversationId(conversationId, cursor);
    }
    sendMessage = trace(async (conversationId, senderId, text) => {
        const isParticipant = await this.conversationRepo.isParticipant(conversationId, senderId);
        if (!isParticipant)
            throw new ForbiddenError('Bạn không phải thành viên của cuộc trò chuyện này');
        const message = await this.messageRepo.create({
            conversationId,
            senderId,
            text,
        });
        await this.conversationRepo.updateTimestamp(conversationId);
        try {
            const channel = `conversation:${conversationId}`;
            getRoomManager().broadcast(channel, 'message.new', message);
        }
        catch {
            // RoomManager not initialized yet (WS not ready)
        }
        logger.info({ messageId: message.id, conversationId, senderId }, 'Message sent');
        return message;
    }, { name: 'ChatService.sendMessage' });
    async markAsRead(conversationId, userId, messageIds) {
        const isParticipant = await this.conversationRepo.isParticipant(conversationId, userId);
        if (!isParticipant)
            throw new ForbiddenError('Bạn không phải thành viên của cuộc trò chuyện này');
        await this.conversationRepo.markAsRead(conversationId, userId, messageIds);
        logger.info({ conversationId, userId, messageIds }, 'Messages marked as read');
    }
}
//# sourceMappingURL=chat.service.js.map