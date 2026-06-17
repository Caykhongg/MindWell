import { eq, like } from 'drizzle-orm';
import { db } from '../config/database.js';
import { botReplies, chatFeedback, } from '../db/schema/bot-replies.js';
export class BotReplyRepository {
    async findAll() {
        return db.select().from(botReplies).orderBy(botReplies.createdAt);
    }
    async findByKeyword(keyword) {
        return db
            .select()
            .from(botReplies)
            .where(like(botReplies.keywords, `%${keyword}%`))
            .orderBy(botReplies.createdAt);
    }
    async create(data) {
        const result = await db.insert(botReplies).values(data).returning();
        return result[0];
    }
    async update(id, data) {
        const result = await db
            .update(botReplies)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(botReplies.id, id))
            .returning();
        return result[0];
    }
    async delete(id) {
        const result = await db.delete(botReplies).where(eq(botReplies.id, id)).returning();
        return result[0];
    }
}
export class ChatFeedbackRepository {
    async create(data) {
        const result = await db
            .insert(chatFeedback)
            .values(data)
            .returning({ id: chatFeedback.id });
        return result[0];
    }
}
//# sourceMappingURL=bot.repository.js.map