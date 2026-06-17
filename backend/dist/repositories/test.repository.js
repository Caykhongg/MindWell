import { eq, desc, count } from 'drizzle-orm';
import { db } from '../config/database.js';
import { mentalTests } from '../db/schema/mental-tests.js';
export class TestRepository {
    async findByUserId(userId, page, limit) {
        const offset = (page - 1) * limit;
        const [total] = await db.select({ total: count() }).from(mentalTests).where(eq(mentalTests.userId, userId));
        const entries = await db
            .select()
            .from(mentalTests)
            .where(eq(mentalTests.userId, userId))
            .orderBy(desc(mentalTests.createdAt))
            .limit(limit)
            .offset(offset);
        return { entries, total: total.total };
    }
    async findById(id) {
        const result = await db.select().from(mentalTests).where(eq(mentalTests.id, id)).limit(1);
        return result[0];
    }
    async create(data) {
        const result = await db.insert(mentalTests).values(data).returning();
        return result[0];
    }
}
//# sourceMappingURL=test.repository.js.map