import type { Response } from 'express';
import { PostService } from '../services/post.service.js';
export declare function postController(postService: PostService): {
    list: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    toggleLike: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    listComments: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    createComment: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    deleteComment: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    updateComment: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=post.controller.d.ts.map