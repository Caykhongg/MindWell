import { eq, and } from 'drizzle-orm';
import { db } from '../config/database.js';
import {
  counselorAvailability,
  counselorTimeOff,
  type CounselorAvailability,
  type NewCounselorAvailability,
  type CounselorTimeOff,
  type NewCounselorTimeOff,
} from '../db/schema/counselor-availability.js';

export class CounselorAvailabilityRepository {
  async findByCounselorId(counselorId: number): Promise<CounselorAvailability[]> {
    return db
      .select()
      .from(counselorAvailability)
      .where(
        and(
          eq(counselorAvailability.counselorId, counselorId),
          eq(counselorAvailability.isAvailable, true)
        )
      );
  }

  async setAvailability(counselorId: number, slots: { dayOfWeek: string; startTime: string; endTime: string }[]) {
    await db.delete(counselorAvailability).where(eq(counselorAvailability.counselorId, counselorId));
    if (slots.length === 0) return [];
    const values = slots.map(s => ({
      counselorId,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isAvailable: true,
    }));
    return db.insert(counselorAvailability).values(values).returning();
  }

  async findTimeOff(counselorId: number): Promise<CounselorTimeOff[]> {
    return db.select().from(counselorTimeOff).where(eq(counselorTimeOff.counselorId, counselorId));
  }

  async addTimeOff(counselorId: number, data: { date: string; reason?: string }) {
    return db.insert(counselorTimeOff).values({ counselorId, ...data }).returning();
  }

  async removeTimeOff(id: number) {
    await db.delete(counselorTimeOff).where(eq(counselorTimeOff.id, id));
  }

  async getAllAvailableTherapists(): Promise<{ id: number }[]> {
    const distinct = await db
      .select({ id: counselorAvailability.counselorId })
      .from(counselorAvailability)
      .where(eq(counselorAvailability.isAvailable, true))
      .groupBy(counselorAvailability.counselorId);
    return distinct;
  }

  async isTherapistAvailable(therapistId: number): Promise<boolean> {
    const result = await db
      .select({ id: counselorAvailability.id })
      .from(counselorAvailability)
      .where(
        and(
          eq(counselorAvailability.counselorId, therapistId),
          eq(counselorAvailability.isAvailable, true)
        )
      )
      .limit(1);
    return result.length > 0;
  }
}
