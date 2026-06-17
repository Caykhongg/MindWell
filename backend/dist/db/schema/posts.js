import { pgTable, serial, integer, varchar, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.js';
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    content: text('content').notNull(),
    isAnonymous: integer('is_anonymous').notNull().$default(() => 0),
    likeCount: integer('like_count').notNull().$default(() => 0),
    commentCount: integer('comment_count').notNull().$default(() => 0),
    guestName: varchar('guest_name', { length: 100 }),
    guestEmail: varchar('guest_email', { length: 255 }),
    createdAt: timestamp('created_at').notNull().$default(() => new Date()),
    updatedAt: timestamp('updated_at').notNull().$default(() => new Date()),
});
export const postLikes = pgTable('post_likes', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().$default(() => new Date()),
}, (t) => ({
    postUserUnique: uniqueIndex('post_likes_post_user_idx').on(t.postId, t.userId),
}));
export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    isAnonymous: integer('is_anonymous').notNull().$default(() => 0),
    guestName: varchar('guest_name', { length: 100 }),
    guestEmail: varchar('guest_email', { length: 255 }),
    createdAt: timestamp('created_at').notNull().$default(() => new Date()),
    updatedAt: timestamp('updated_at').notNull().$default(() => new Date()),
});
//# sourceMappingURL=posts.js.map