import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
export class PostService {
    postRepo;
    likeRepo;
    commentRepo;
    constructor(postRepo, likeRepo, commentRepo) {
        this.postRepo = postRepo;
        this.likeRepo = likeRepo;
        this.commentRepo = commentRepo;
    }
    async list(page, limit) {
        return this.postRepo.findAll(page, limit);
    }
    async getById(id) {
        const post = await this.postRepo.findById(id);
        if (!post) {
            throw new NotFoundError('bài viết');
        }
        return post;
    }
    async create(userId, data) {
        const post = await this.postRepo.create({
            userId,
            title: data.title,
            content: data.content,
            isAnonymous: data.isAnonymous ? 1 : 0,
            guestName: data.guestName,
            guestEmail: data.guestEmail,
        });
        logger.info({ postId: post.id, userId }, 'Post created');
        return post;
    }
    async update(id, userId, data) {
        const post = await this.postRepo.findById(id);
        if (!post) {
            throw new NotFoundError('bài viết');
        }
        if (post.userId !== userId) {
            throw new ForbiddenError('Bạn không có quyền sửa bài viết này');
        }
        const dbData = { ...data };
        if (dbData.isAnonymous !== undefined) {
            dbData.isAnonymous = dbData.isAnonymous ? 1 : 0;
        }
        const updated = await this.postRepo.update(id, dbData);
        return updated;
    }
    async delete(id, userId, userRole) {
        const post = await this.postRepo.findById(id);
        if (!post) {
            throw new NotFoundError('bài viết');
        }
        if (userId && post.userId !== userId && userRole !== 'admin') {
            throw new ForbiddenError('Bạn không có quyền xoá bài viết này');
        }
        await this.postRepo.delete(id);
        logger.info({ postId: id, userId }, 'Post deleted');
    }
    async toggleLike(postId, userId) {
        const post = await this.postRepo.findById(postId);
        if (!post) {
            throw new NotFoundError('bài viết');
        }
        const existing = await this.likeRepo.findByPostAndUser(postId, userId);
        if (existing) {
            await this.likeRepo.delete(existing.id);
            await this.postRepo.decrementLikeCount(postId);
            return { liked: false };
        }
        await this.likeRepo.create({ postId, userId });
        await this.postRepo.incrementLikeCount(postId);
        return { liked: true };
    }
    async listComments(postId, page, limit) {
        const post = await this.postRepo.findById(postId);
        if (!post) {
            throw new NotFoundError('bài viết');
        }
        return this.commentRepo.findByPostId(postId, page, limit);
    }
    async createComment(postId, userId, data) {
        const post = await this.postRepo.findById(postId);
        if (!post) {
            throw new NotFoundError('bài viết');
        }
        const comment = await this.commentRepo.create({
            postId,
            userId,
            content: data.content,
            isAnonymous: data.isAnonymous ? 1 : 0,
            guestName: data.guestName,
            guestEmail: data.guestEmail,
        });
        await this.postRepo.incrementCommentCount(postId);
        logger.info({ commentId: comment.id, postId, userId }, 'Comment created');
        return comment;
    }
    async deleteComment(postId, commentId, userId, userRole) {
        const post = await this.postRepo.findById(postId);
        if (!post) {
            throw new NotFoundError('bài viết');
        }
        const comment = await this.commentRepo.findById(commentId);
        if (!comment) {
            throw new NotFoundError('bình luận');
        }
        const isCommentOwner = comment.userId === userId;
        const isPostOwner = post.userId === userId;
        const isAdmin = userRole === 'admin';
        if (!isCommentOwner && !isPostOwner && !isAdmin) {
            throw new ForbiddenError('Bạn không có quyền xoá bình luận này');
        }
        await this.commentRepo.delete(commentId);
        await this.postRepo.decrementCommentCount(postId);
        logger.info({ commentId, postId, userId }, 'Comment deleted');
    }
    async updateComment(commentId, userId, data) {
        const comment = await this.commentRepo.findById(commentId);
        if (!comment) {
            throw new NotFoundError('bình luận');
        }
        if (comment.userId !== userId) {
            throw new ForbiddenError('Bạn không có quyền sửa bình luận này');
        }
        const updated = await this.commentRepo.update(commentId, {
            content: data.content,
            isAnonymous: data.isAnonymous !== undefined ? (data.isAnonymous ? 1 : 0) : comment.isAnonymous,
        });
        return updated;
    }
}
//# sourceMappingURL=post.service.js.map