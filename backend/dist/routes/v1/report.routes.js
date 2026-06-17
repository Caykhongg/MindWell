import { Router } from 'express';
import { ReportService } from '../../services/report.service.js';
import { reportController } from '../../controllers/report.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
const router = Router();
const service = new ReportService();
const controller = reportController(service);
router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.list);
router.patch('/:id/resolve', authenticate, controller.resolve);
export default router;
//# sourceMappingURL=report.routes.js.map