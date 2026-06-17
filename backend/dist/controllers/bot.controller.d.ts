import type { Response } from 'express';
import { BotService } from '../services/bot.service.js';
export declare function botController(botService: BotService): {
    chat: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    listReplies: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    createReply: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    updateReply: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    deleteReply: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    submitFeedback: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=bot.controller.d.ts.map