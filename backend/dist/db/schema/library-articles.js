import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';
export const libraryArticles = pgTable('library_articles', {
    id: serial('id').primaryKey(),
    authorId: integer('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    category: varchar('category', { length: 100 }).notNull().default('general'),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    tags: text('tags'),
    createdAt: timestamp('created_at').notNull().$default(() => new Date()),
    updatedAt: timestamp('updated_at').notNull().$default(() => new Date()),
});
//# sourceMappingURL=library-articles.js.map