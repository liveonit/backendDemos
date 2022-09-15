import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { authSvc } from '@src/services/auth';
import { Router } from 'express';
import BookController from './Book.controller';

const bookController = new BookController();

const router = Router();

/**
 * Get book
 */
router.get('/:id', authSvc.authRequiredMiddleware([]), bookController.getById);

/**
 * List autors
 */
router.get('/', authSvc.authRequiredMiddleware([]), bookController.getMany);

/**
 * Create autor
 */
router.post('/', authSvc.authRequiredMiddleware(['editBooks']), bookController.create);

/**
 * Update autor
 */
router.put('/', authSvc.authRequiredMiddleware(['editBooks']), bookController.create);

/**
 * Delete autor
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['editBooks']), bookController.delete);

export default router;
