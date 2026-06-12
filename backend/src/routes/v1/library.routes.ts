import { Router } from 'express';
import { libraryController } from '../../controllers/library.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/articles', libraryController.list);
router.get('/articles/categories', libraryController.categories);
router.get('/articles/all', authenticate, requireRole('therapist', 'admin'), libraryController.listAll);
router.get('/articles/:id', libraryController.detail);
router.post('/articles', authenticate, requireRole('therapist', 'admin'), libraryController.create);
router.patch('/articles/:id', authenticate, requireRole('therapist', 'admin'), libraryController.update);
router.delete('/articles/:id', authenticate, requireRole('therapist', 'admin'), libraryController.remove);

export default router;
