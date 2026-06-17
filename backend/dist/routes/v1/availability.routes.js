import { Router } from 'express';
import { CounselorAvailabilityService } from '../../services/counselor-availability.service.js';
import { CounselorAvailabilityRepository } from '../../repositories/counselor-availability.repository.js';
import { counselorAvailabilityController } from '../../controllers/counselor-availability.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
const router = Router();
const repo = new CounselorAvailabilityRepository();
const service = new CounselorAvailabilityService(repo);
const controller = counselorAvailabilityController(service);
router.get('/', authenticate, controller.getSchedule);
router.put('/', authenticate, controller.setSchedule);
router.post('/time-off', authenticate, controller.addTimeOff);
router.delete('/time-off/:id', authenticate, controller.removeTimeOff);
export default router;
//# sourceMappingURL=availability.routes.js.map