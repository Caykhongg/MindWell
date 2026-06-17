import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
export function botController(botService) {
    return {
        chat: asyncHandler(async (req, res) => {
            const { message } = req.body;
            const result = await botService.chat(message, req.userId);
            res.json(success(result));
        }),
        listReplies: asyncHandler(async (_req, res) => {
            const replies = await botService.listReplies();
            res.json(success(replies));
        }),
        createReply: asyncHandler(async (req, res) => {
            const data = req.body;
            const reply = await botService.createReply(data);
            res.status(201).json(success(reply));
        }),
        updateReply: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const data = req.body;
            const reply = await botService.updateReply(id, data);
            res.json(success(reply));
        }),
        deleteReply: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const reply = await botService.deleteReply(id);
            res.json(success(reply));
        }),
        submitFeedback: asyncHandler(async (req, res) => {
            const data = req.body;
            const result = await botService.submitFeedback(data, req.userId);
            res.status(201).json(success(result));
        }),
    };
}
//# sourceMappingURL=bot.controller.js.map