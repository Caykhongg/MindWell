import { Router } from 'express';
import { ReportService } from '../../services/report.service.js';
import { reportController } from '../../controllers/report.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

const service = new ReportService();
const controller = reportController(service);

router.post('/', authenticate, controller.create);
router.get('/', authenticate, requireRole('admin'), controller.list);
router.patch('/:id/resolve', authenticate, requireRole('admin'), controller.resolve);

export default router;
