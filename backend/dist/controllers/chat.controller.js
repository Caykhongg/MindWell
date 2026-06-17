import { eq, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { users } from '../db/schema/users.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
export function chatController(chatService) {
    return {
        convList: asyncHandler(async (req, res) => {
            const conversations = await chatService.getConversations(req.userId);
            res.json(success(conversations));
        }),
        convDetail: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const detail = await chatService.getConversationDetail(id, req.userId);
            res.json(success(detail));
        }),
        createConv: asyncHandler(async (req, res) => {
            const { contactId } = req.body;
            const conversation = await chatService.createConversation(req.userId, contactId);
            res.status(201).json(success(conversation));
        }),
        messageList: asyncHandler(async (req, res) => {
            const conversationId = parseInt(req.params.id, 10);
            const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : undefined;
            const result = await chatService.getMessages(conversationId, req.userId, cursor);
            res.json(success(result.entries, { hasMore: result.hasMore }));
        }),
        sendMessage: asyncHandler(async (req, res) => {
            const conversationId = parseInt(req.params.id, 10);
            const { text } = req.body;
            const message = await chatService.sendMessage(conversationId, req.userId, text);
            res.status(201).json(success(message));
        }),
        listTherapists: asyncHandler(async (_req, res) => {
            const therapists = await db.select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
            }).from(users).where(eq(users.role, 'therapist'));
            res.json(success(therapists));
        }),
        searchUsers: asyncHandler(async (req, res) => {
            const q = req.query.q || '';
            if (!q.trim()) {
                res.json(success([]));
                return;
            }
            const results = await db.select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
            })
                .from(users)
                .where(sql `LOWER(${users.name}) LIKE LOWER(${'%' + q.trim() + '%'})`)
                .limit(20);
            res.json(success(results));
        }),
        markRead: asyncHandler(async (req, res) => {
            const conversationId = parseInt(req.params.id, 10);
            const { messageIds } = req.body;
            await chatService.markAsRead(conversationId, req.userId, messageIds);
            res.json(success({ message: 'Đã đánh dấu đã đọc' }));
        }),
    };
}
//# sourceMappingURL=chat.controller.js.map