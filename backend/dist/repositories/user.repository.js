import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { users } from '../db/schema/users.js';
export class UserRepository {
    async findById(id) {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0];
    }
    async findByEmail(email) {
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return result[0];
    }
    async findByResetToken(token) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.passwordResetToken, token))
            .limit(1);
        return result[0];
    }
    async create(data) {
        const result = await db.insert(users).values(data).returning();
        return result[0];
    }
    async update(id, data) {
        const result = await db.update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }
    async delete(id) {
        await db.delete(users).where(eq(users.id, id));
    }
}
//# sourceMappingURL=user.repository.js.map