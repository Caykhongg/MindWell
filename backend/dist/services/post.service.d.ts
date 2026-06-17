import { PostRepository, PostLikeRepository, CommentRepository } from '../repositories/post.repository.js';
export declare class PostService {
    private postRepo;
    private likeRepo;
    private commentRepo;
    constructor(postRepo: PostRepository, likeRepo: PostLikeRepository, commentRepo: CommentRepository);
    list(page: number, limit: number): Promise<{
        entries: import("../db/schema/posts.js").Post[];
        total: number;
    }>;
    getById(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        title: string;
        content: string;
        isAnonymous: number;
        likeCount: number;
        commentCount: number;
        guestName: string | null;
        guestEmail: string | null;
    }>;
    create(userId: number | null, data: {
        title: string;
        content: string;
        isAnonymous?: boolean;
        guestName?: string;
        guestEmail?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        title: string;
        content: string;
        isAnonymous: number;
        likeCount: number;
        commentCount: number;
        guestName: string | null;
        guestEmail: string | null;
    }>;
    update(id: number, userId: number | null, data: Partial<{
        title: string;
        content: string;
        isAnonymous?: boolean;
    }>): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        title: string;
        content: string;
        isAnonymous: number;
        likeCount: number;
        commentCount: number;
        guestName: string | null;
        guestEmail: string | null;
    }>;
    delete(id: number, userId: number | null, userRole: string): Promise<void>;
    toggleLike(postId: number, userId: number): Promise<{
        liked: boolean;
    }>;
    listComments(postId: number, page: number, limit: number): Promise<{
        entries: import("../db/schema/posts.js").Comment[];
        total: number;
    }>;
    createComment(postId: number, userId: number | null, data: {
        content: string;
        isAnonymous?: boolean;
        guestName?: string;
        guestEmail?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        content: string;
        isAnonymous: number;
        guestName: string | null;
        guestEmail: string | null;
        postId: number;
    }>;
    deleteComment(postId: number, commentId: number, userId: number, userRole: string): Promise<void>;
    updateComment(commentId: number, userId: number, data: {
        content: string;
        isAnonymous?: boolean;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        content: string;
        isAnonymous: number;
        guestName: string | null;
        guestEmail: string | null;
        postId: number;
    }>;
}
//# sourceMappingURL=post.service.d.ts.map