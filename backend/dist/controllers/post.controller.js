import { asyncHandler } from '../middleware/async-handler.js';
import { success, paginated } from '../utils/response.js';
export function postController(postService) {
    return {
        list: asyncHandler(async (req, res) => {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const { entries, total } = await postService.list(page, limit);
            res.json(paginated(entries, total, page, limit));
        }),
        getById: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const post = await postService.getById(id);
            res.json(success(post));
        }),
        create: asyncHandler(async (req, res) => {
            const { title, content, isAnonymous, guestName, guestEmail } = req.body;
            const post = await postService.create(req.userId ?? null, { title, content, isAnonymous, guestName, guestEmail });
            res.status(201).json(success(post));
        }),
        update: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const { title, content, isAnonymous } = req.body;
            const post = await postService.update(id, req.userId, { title, content, isAnonymous });
            res.json(success(post));
        }),
        delete: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            await postService.delete(id, req.userId, req.userRole);
            res.json(success({ message: 'Xoá bài viết thành công' }));
        }),
        toggleLike: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const result = await postService.toggleLike(id, req.userId);
            res.json(success(result));
        }),
        listComments: asyncHandler(async (req, res) => {
            const postId = parseInt(req.params.id, 10);
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const { entries, total } = await postService.listComments(postId, page, limit);
            res.json(paginated(entries, total, page, limit));
        }),
        createComment: asyncHandler(async (req, res) => {
            const postId = parseInt(req.params.id, 10);
            const { content, isAnonymous, guestName, guestEmail } = req.body;
            const comment = await postService.createComment(postId, req.userId ?? null, { content, isAnonymous, guestName, guestEmail });
            res.status(201).json(success(comment));
        }),
        deleteComment: asyncHandler(async (req, res) => {
            const postId = parseInt(req.params.id, 10);
            const commentId = parseInt(req.params.commentId, 10);
            await postService.deleteComment(postId, commentId, req.userId, req.userRole);
            res.json(success({ message: 'Xoá bình luận thành công' }));
        }),
        updateComment: asyncHandler(async (req, res) => {
            const commentId = parseInt(req.params.commentId, 10);
            const { content, isAnonymous } = req.body;
            const comment = await postService.updateComment(commentId, req.userId, { content, isAnonymous });
            res.json(success(comment));
        }),
    };
}
//# sourceMappingURL=post.controller.js.map