import type { Response } from 'express';
import { ChatService } from '../services/chat.service.js';
export declare function chatController(chatService: ChatService): {
    convList: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    convDetail: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    createConv: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    messageList: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    sendMessage: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    listTherapists: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    searchUsers: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    markRead: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=chat.controller.d.ts.map