import { type Post, type NewPost, type PostLike, type NewPostLike, type Comment, type NewComment } from '../db/schema/posts.js';
export declare class PostRepository {
    findAll(page: number, limit: number): Promise<{
        entries: Post[];
        total: number;
    }>;
    findById(id: number): Promise<Post | undefined>;
    findByUserId(userId: number, page: number, limit: number): Promise<{
        entries: Post[];
        total: number;
    }>;
    create(data: NewPost): Promise<Post>;
    update(id: number, data: Partial<NewPost>): Promise<Post | undefined>;
    delete(id: number): Promise<void>;
    incrementLikeCount(id: number): Promise<void>;
    decrementLikeCount(id: number): Promise<void>;
    incrementCommentCount(id: number): Promise<void>;
    decrementCommentCount(id: number): Promise<void>;
}
export declare class PostLikeRepository {
    findByPostAndUser(postId: number, userId: number): Promise<PostLike | undefined>;
    create(data: NewPostLike): Promise<PostLike>;
    delete(id: number): Promise<void>;
}
export declare class CommentRepository {
    findByPostId(postId: number, page: number, limit: number): Promise<{
        entries: Comment[];
        total: number;
    }>;
    findById(id: number): Promise<Comment | undefined>;
    create(data: NewComment): Promise<Comment>;
    update(id: number, data: Partial<NewComment>): Promise<Comment | undefined>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=post.repository.d.ts.map