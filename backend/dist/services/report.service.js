import { db } from '../config/database.js';
import { reports } from '../db/schema/reports.js';
import { notifications } from '../db/schema/notifications.js';
import { posts } from '../db/schema/posts.js';
import { NotificationService } from './notification.service.js';
import { users } from '../db/schema/users.js';
import { eq, and } from 'drizzle-orm';
import { logger } from '../utils/logger.js';
const notifService = new NotificationService();
export class ReportService {
    async create(reporterId, data) {
        const report = await db.insert(reports).values({
            postId: data.postId,
            reporterId,
            reason: data.reason,
        }).returning();
        const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'));
        for (const admin of admins) {
            await notifService.create({
                userId: admin.id,
                type: 'report',
                title: 'Bài viết bị tố cáo',
                message: `Bài viết #${data.postId} bị tố cáo: ${data.reason.slice(0, 100)}`,
                relatedId: data.postId,
            });
        }
        logger.info({ reportId: report[0].id, postId: data.postId, reporterId }, 'Report created');
        return report[0];
    }
    async list() {
        return db.select().from(reports).orderBy(reports.createdAt);
    }
    async resolve(id, action) {
        const [report] = await db.update(reports).set({ isResolved: true }).where(eq(reports.id, id)).returning();
        if (!report)
            return null;
        // Mark admin notifications about this report as read
        const notifs = await db.select().from(notifications).where(and(eq(notifications.type, 'report'), eq(notifications.relatedId, report.postId)));
        for (const n of notifs) {
            await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, n.id));
        }
        // Notify the reporter
        await notifService.create({
            userId: report.reporterId,
            type: 'report_resolved',
            title: action === 'delete' ? 'Bài viết đã bị xoá' : 'Tố cáo đã được xem xét',
            message: action === 'delete'
                ? `Bài viết #${report.postId} đã bị xoá do vi phạm quy định.`
                : `Tố cáo bài viết #${report.postId} đã được xem xét và không cần xử lý thêm.`,
            relatedId: report.postId,
        });
        // If delete action, remove the post and notify the original poster
        if (action === 'delete') {
            const [post] = await db.select().from(posts).where(eq(posts.id, report.postId)).limit(1);
            await db.delete(posts).where(eq(posts.id, report.postId));
            if (post?.userId) {
                await notifService.create({
                    userId: post.userId,
                    type: 'post_deleted',
                    title: 'Bài viết của bạn đã bị xoá',
                    message: `Bài viết "${post.title}" đã bị xoá do vi phạm quy định cộng đồng.`,
                    relatedId: report.postId,
                });
            }
        }
        logger.info({ reportId: id, action }, 'Report resolved');
        return report;
    }
}
//# sourceMappingURL=report.service.js.map