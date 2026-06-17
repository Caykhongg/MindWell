import { eq, desc, count } from 'drizzle-orm';
import { db } from '../config/database.js';
import { notifications } from '../db/schema/notifications.js';
export class NotificationService {
    async list(userId) {
        return db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(50);
    }
    async create(data) {
        const result = await db.insert(notifications).values(data).returning();
        return result[0];
    }
    async markRead(id, userId) {
        await db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, id));
    }
    async markAllRead(userId) {
        await db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId));
    }
    async unreadCount(userId) {
        const result = await db
            .select({ count: count() })
            .from(notifications)
            .where(eq(notifications.isRead, false));
        return Number(result[0]?.count ?? 0);
    }
}
//# sourceMappingURL=notification.service.js.map