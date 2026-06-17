import { eq, desc, count, and, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { posts, postLikes, comments, } from '../db/schema/posts.js';
export class PostRepository {
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const [total] = await db.select({ total: count() }).from(posts);
        const entries = await db
            .select()
            .from(posts)
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset);
        return { entries, total: total.total };
    }
    async findById(id) {
        const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
        return result[0];
    }
    async findByUserId(userId, page, limit) {
        const offset = (page - 1) * limit;
        const [total] = await db.select({ total: count() }).from(posts).where(eq(posts.userId, userId));
        const entries = await db
            .select()
            .from(posts)
            .where(eq(posts.userId, userId))
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset);
        return { entries, total: total.total };
    }
    async create(data) {
        const result = await db.insert(posts).values(data).returning();
        return result[0];
    }
    async update(id, data) {
        const result = await db
            .update(posts)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(posts.id, id))
            .returning();
        return result[0];
    }
    async delete(id) {
        await db.delete(posts).where(eq(posts.id, id));
    }
    async incrementLikeCount(id) {
        await db
            .update(posts)
            .set({ likeCount: sql `${posts.likeCount} + 1` })
            .where(eq(posts.id, id));
    }
    async decrementLikeCount(id) {
        await db
            .update(posts)
            .set({ likeCount: sql `${posts.likeCount} - 1` })
            .where(eq(posts.id, id));
    }
    async incrementCommentCount(id) {
        await db
            .update(posts)
            .set({ commentCount: sql `${posts.commentCount} + 1` })
            .where(eq(posts.id, id));
    }
    async decrementCommentCount(id) {
        await db
            .update(posts)
            .set({ commentCount: sql `${posts.commentCount} - 1` })
            .where(eq(posts.id, id));
    }
}
export class PostLikeRepository {
    async findByPostAndUser(postId, userId) {
        const result = await db
            .select()
            .from(postLikes)
            .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
            .limit(1);
        return result[0];
    }
    async create(data) {
        const result = await db.insert(postLikes).values(data).returning();
        return result[0];
    }
    async delete(id) {
        await db.delete(postLikes).where(eq(postLikes.id, id));
    }
}
export class CommentRepository {
    async findByPostId(postId, page, limit) {
        const offset = (page - 1) * limit;
        const [total] = await db.select({ total: count() }).from(comments).where(eq(comments.postId, postId));
        const entries = await db
            .select()
            .from(comments)
            .where(eq(comments.postId, postId))
            .orderBy(desc(comments.createdAt))
            .limit(limit)
            .offset(offset);
        return { entries, total: total.total };
    }
    async findById(id) {
        const result = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
        return result[0];
    }
    async create(data) {
        const result = await db.insert(comments).values(data).returning();
        return result[0];
    }
    async update(id, data) {
        const result = await db
            .update(comments)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(comments.id, id))
            .returning();
        return result[0];
    }
    async delete(id) {
        await db.delete(comments).where(eq(comments.id, id));
    }
}
//# sourceMappingURL=post.repository.js.map