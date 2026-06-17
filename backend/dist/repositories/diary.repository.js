import { eq, desc, count } from 'drizzle-orm';
import { db } from '../config/database.js';
import { diaryEntries } from '../db/schema/diary-entries.js';
export class DiaryRepository {
    async findByUserId(userId, page, limit) {
        const offset = (page - 1) * limit;
        const [total] = await db.select({ total: count() }).from(diaryEntries).where(eq(diaryEntries.userId, userId));
        const entries = await db
            .select()
            .from(diaryEntries)
            .where(eq(diaryEntries.userId, userId))
            .orderBy(desc(diaryEntries.createdAt))
            .limit(limit)
            .offset(offset);
        return { entries, total: total.total };
    }
    async findById(id) {
        const result = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id)).limit(1);
        return result[0];
    }
    async create(data) {
        const result = await db.insert(diaryEntries).values(data).returning();
        return result[0];
    }
    async update(id, data) {
        const result = await db
            .update(diaryEntries)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(diaryEntries.id, id))
            .returning();
        return result[0];
    }
    async delete(id) {
        await db.delete(diaryEntries).where(eq(diaryEntries.id, id));
    }
}
//# sourceMappingURL=diary.repository.js.map