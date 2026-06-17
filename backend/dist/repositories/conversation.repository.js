import { eq, desc, and, inArray, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { users } from '../db/schema/users.js';
import { conversations, conversationParticipants, messages, } from '../db/schema/conversations.js';
export class ConversationRepository {
    async create(data) {
        const result = await db.insert(conversations).values(data).returning();
        return result[0];
    }
    async findById(id) {
        const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
        return result[0];
    }
    async findExistingPrivateConversation(userId, contactId) {
        const userConvs = db.$with('user_convs').as(db
            .select({ conversationId: conversationParticipants.conversationId })
            .from(conversationParticipants)
            .where(eq(conversationParticipants.userId, userId)));
        const result = await db
            .with(userConvs)
            .select({ conversationId: conversationParticipants.conversationId })
            .from(conversationParticipants)
            .innerJoin(userConvs, eq(conversationParticipants.conversationId, sql `${userConvs}.conversation_id`))
            .where(eq(conversationParticipants.userId, contactId))
            .limit(1);
        if (result.length === 0)
            return undefined;
        return this.findById(result[0].conversationId);
    }
    async findByUserId(userId) {
        const result = await db
            .select({
            conversation: conversations,
            lastMessage: messages,
            participantId: conversationParticipants.userId,
            userName: users.name,
            userEmail: users.email,
            userRole: users.role,
            userAvatarUrl: users.avatarUrl,
        })
            .from(conversations)
            .innerJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
            .innerJoin(users, eq(conversationParticipants.userId, users.id))
            .leftJoin(messages, sql `${messages.conversationId} = ${conversations.id} AND ${messages.createdAt} = (
          SELECT MAX(created_at) FROM ${messages} WHERE conversation_id = ${conversations.id}
        )`)
            .where(inArray(conversations.id, db
            .select({ id: conversationParticipants.conversationId })
            .from(conversationParticipants)
            .where(eq(conversationParticipants.userId, userId))))
            .orderBy(desc(conversations.updatedAt));
        const grouped = new Map();
        for (const row of result) {
            const existing = grouped.get(row.conversation.id);
            if (existing) {
                existing.participants.push({ id: row.participantId, name: row.userName, email: row.userEmail, role: row.userRole, avatarUrl: row.userAvatarUrl });
            }
            else {
                grouped.set(row.conversation.id, {
                    conversation: row.conversation,
                    lastMessage: row.lastMessage,
                    participants: [{ id: row.participantId, name: row.userName, email: row.userEmail, role: row.userRole, avatarUrl: row.userAvatarUrl }],
                });
            }
        }
        return Array.from(grouped.values());
    }
    async updateTimestamp(id) {
        await db
            .update(conversations)
            .set({ updatedAt: new Date() })
            .where(eq(conversations.id, id));
    }
    async addParticipant(data) {
        const result = await db.insert(conversationParticipants).values(data).returning();
        return result[0];
    }
    async addParticipants(data) {
        if (data.length === 0)
            return [];
        const result = await db.insert(conversationParticipants).values(data).returning();
        return result;
    }
    async findParticipants(conversationId) {
        return db
            .select()
            .from(conversationParticipants)
            .where(eq(conversationParticipants.conversationId, conversationId));
    }
    async isParticipant(conversationId, userId) {
        const result = await db
            .select({ id: conversationParticipants.id })
            .from(conversationParticipants)
            .where(and(eq(conversationParticipants.conversationId, conversationId), eq(conversationParticipants.userId, userId)))
            .limit(1);
        return result.length > 0;
    }
    async markAsRead(conversationId, userId, messageIds) {
        await db
            .update(conversationParticipants)
            .set({ lastReadAt: new Date() })
            .where(and(eq(conversationParticipants.conversationId, conversationId), eq(conversationParticipants.userId, userId)));
        if (messageIds.length > 0) {
            await db
                .update(messages)
                .set({ isRead: 1 })
                .where(and(eq(messages.conversationId, conversationId), inArray(messages.id, messageIds), sql `${messages.senderId} != ${userId}`));
        }
    }
}
//# sourceMappingURL=conversation.repository.js.map