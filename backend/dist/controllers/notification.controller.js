import { NotificationService } from '../services/notification.service.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
const service = new NotificationService();
export const notificationController = {
    list: asyncHandler(async (req, res) => {
        const notifs = await service.list(req.userId);
        res.json(success(notifs));
    }),
    markRead: asyncHandler(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        await service.markRead(id, req.userId);
        res.json(success({ message: 'Đã đánh dấu đã đọc' }));
    }),
    markAllRead: asyncHandler(async (req, res) => {
        await service.markAllRead(req.userId);
        res.json(success({ message: 'Đã đánh dấu tất cả đã đọc' }));
    }),
    unreadCount: asyncHandler(async (req, res) => {
        const count = await service.unreadCount(req.userId);
        res.json(success({ count }));
    }),
};
//# sourceMappingURL=notification.controller.js.map