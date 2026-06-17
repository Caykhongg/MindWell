import { eq, and } from 'drizzle-orm';
import { db } from '../config/database.js';
import { counselorAvailability, counselorTimeOff, } from '../db/schema/counselor-availability.js';
export class CounselorAvailabilityRepository {
    async findByCounselorId(counselorId) {
        return db
            .select()
            .from(counselorAvailability)
            .where(and(eq(counselorAvailability.counselorId, counselorId), eq(counselorAvailability.isAvailable, true)));
    }
    async setAvailability(counselorId, slots) {
        await db.delete(counselorAvailability).where(eq(counselorAvailability.counselorId, counselorId));
        if (slots.length === 0)
            return [];
        const values = slots.map(s => ({
            counselorId,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isAvailable: true,
        }));
        return db.insert(counselorAvailability).values(values).returning();
    }
    async findTimeOff(counselorId) {
        return db.select().from(counselorTimeOff).where(eq(counselorTimeOff.counselorId, counselorId));
    }
    async addTimeOff(counselorId, data) {
        return db.insert(counselorTimeOff).values({ counselorId, ...data }).returning();
    }
    async removeTimeOff(id) {
        await db.delete(counselorTimeOff).where(eq(counselorTimeOff.id, id));
    }
    async getAllAvailableTherapists() {
        const distinct = await db
            .select({ id: counselorAvailability.counselorId })
            .from(counselorAvailability)
            .where(eq(counselorAvailability.isAvailable, true))
            .groupBy(counselorAvailability.counselorId);
        return distinct;
    }
    async isTherapistAvailable(therapistId) {
        const result = await db
            .select({ id: counselorAvailability.id })
            .from(counselorAvailability)
            .where(and(eq(counselorAvailability.counselorId, therapistId), eq(counselorAvailability.isAvailable, true)))
            .limit(1);
        return result.length > 0;
    }
}
//# sourceMappingURL=counselor-availability.repository.js.map