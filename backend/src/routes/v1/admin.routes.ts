import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { users } from '../../db/schema/users.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../middleware/async-handler.js';
import { success, errorResponse } from '../../utils/response.js';
import { logger } from '../../utils/logger.js';
import type { AuthRequest } from '../../middleware/auth.middleware.js';

const router = Router();

router.patch('/users/:id/role', authenticate, requireRole('admin'), asyncHandler(async (req: AuthRequest, res) => {
  const userId = parseInt(req.params.id as string, 10);
  const { role } = req.body;

  if (!['patient', 'therapist', 'admin'].includes(role)) {
    return res.status(400).json(errorResponse('INVALID_ROLE', 'Vai trò không hợp lệ'));
  }

  const user = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];
  if (!user) {
    return res.status(404).json(errorResponse('NOT_FOUND', 'Người dùng không tồn tại'));
  }

  await db.update(users).set({ role }).where(eq(users.id, userId));

  logger.info({ adminId: req.userId, targetUserId: userId, newRole: role }, 'User role updated');
  res.json(success({ message: `Đã cập nhật vai trò thành ${role}` }));
}));

export default router;
