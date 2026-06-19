import { eq, ne, desc, lt, and, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { messages, } from '../db/schema/conversations.js';
export class MessageRepository {
    async create(data) {
        const result = await db.insert(messages).values(data).returning();
        return result[0];
    }
    async findByConversationId(conversationId, cursor, limit = 50) {
        const take = limit + 1;
        const conditions = [eq(messages.conversationId, conversationId)];
        if (cursor)
            conditions.push(lt(messages.id, cursor));
        const result = await db
            .select()
            .from(messages)
            .where(and(...conditions))
            .orderBy(desc(messages.createdAt))
            .limit(take);
        const hasMore = result.length > limit;
        const entries = hasMore ? result.slice(0, limit) : result;
        return { entries, hasMore };
    }
    async findById(id) {
        const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
        return result[0];
    }
    async findUnreadCount(conversationId, userId) {
        const [result] = await db
            .select({ count: sql `count(*)` })
            .from(messages)
            .where(and(eq(messages.conversationId, conversationId), eq(messages.isRead, 0), ne(messages.senderId, userId)));
        return Number(result?.count || 0);
    }
}
//# sourceMappingURL=message.repository.js.map