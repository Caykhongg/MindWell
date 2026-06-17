import { eq, desc, count, and } from 'drizzle-orm';
import { db } from '../config/database.js';
import { appointments, } from '../db/schema/appointments.js';
export class AppointmentRepository {
    async findByUserId(userId, page, limit) {
        const offset = (page - 1) * limit;
        const [total] = await db
            .select({ total: count() })
            .from(appointments)
            .where(eq(appointments.userId, userId));
        const entries = await db
            .select()
            .from(appointments)
            .where(eq(appointments.userId, userId))
            .orderBy(desc(appointments.date))
            .limit(limit)
            .offset(offset);
        return { entries, total: total.total };
    }
    async findByTherapistId(therapistId, page, limit) {
        const offset = (page - 1) * limit;
        const [total] = await db
            .select({ total: count() })
            .from(appointments)
            .where(eq(appointments.therapistId, therapistId));
        const entries = await db
            .select()
            .from(appointments)
            .where(eq(appointments.therapistId, therapistId))
            .orderBy(desc(appointments.date))
            .limit(limit)
            .offset(offset);
        return { entries, total: total.total };
    }
    async findById(id) {
        const result = await db
            .select()
            .from(appointments)
            .where(eq(appointments.id, id))
            .limit(1);
        return result[0];
    }
    async findConflicting(date, userId) {
        const result = await db
            .select()
            .from(appointments)
            .where(and(eq(appointments.userId, userId), eq(appointments.date, date), eq(appointments.status, 'pending')))
            .limit(1);
        return result[0];
    }
    async create(data) {
        const result = await db.insert(appointments).values(data).returning();
        return result[0];
    }
    async update(id, data) {
        const result = await db
            .update(appointments)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(appointments.id, id))
            .returning();
        return result[0];
    }
    async delete(id) {
        await db.delete(appointments).where(eq(appointments.id, id));
    }
}
//# sourceMappingURL=appointment.repository.js.map