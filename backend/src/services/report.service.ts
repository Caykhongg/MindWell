import { db } from '../config/database.js';
import { reports } from '../db/schema/reports.js';
import { NotificationService } from './notification.service.js';
import { users } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

const notifService = new NotificationService();

export class ReportService {
  async create(reporterId: number, data: { postId: number; reason: string }) {
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

  async resolve(id: number) {
    const result = await db.update(reports).set({ isResolved: true }).where(eq(reports.id, id)).returning();
    return result[0];
  }
}
