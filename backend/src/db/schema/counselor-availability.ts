import { pgTable, serial, integer, varchar, boolean, time } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const counselorAvailability = pgTable('counselor_availability', {
  id: serial('id').primaryKey(),
  counselorId: integer('counselor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dayOfWeek: varchar('day_of_week', { length: 10 }).notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  isAvailable: boolean('is_available').notNull().$default(() => true),
});

export const counselorTimeOff = pgTable('counselor_time_off', {
  id: serial('id').primaryKey(),
  counselorId: integer('counselor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: varchar('date', { length: 20 }).notNull(),
  reason: varchar('reason', { length: 255 }),
});

export type CounselorAvailability = typeof counselorAvailability.$inferSelect;
export type NewCounselorAvailability = typeof counselorAvailability.$inferInsert;
export type CounselorTimeOff = typeof counselorTimeOff.$inferSelect;
export type NewCounselorTimeOff = typeof counselorTimeOff.$inferInsert;
