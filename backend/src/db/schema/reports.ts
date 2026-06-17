import { pgTable, serial, integer, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { posts } from './posts.js';

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  reporterId: integer('reporter_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reason: varchar('reason', { length: 500 }).notNull(),
  isResolved: boolean('is_resolved').notNull().$default(() => false),
  createdAt: timestamp('created_at').notNull().$default(() => new Date()),
});

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
