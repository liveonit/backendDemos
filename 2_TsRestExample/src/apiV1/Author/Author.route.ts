import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { authSvc } from '@src/services/auth';
import { Router } from 'express';
import AuthorController from './Author.controller';

const authorController = new AuthorController();

const router = Router();

/**
 * Get author
 */
router.get('/:id', authSvc.authRequiredMiddleware([]), authorController.getById);

/**
 * List autors
 */
router.get('/', authSvc.authRequiredMiddleware([]), authorController.getMany);

/**
 * Create autor
 */
router.post('/', authSvc.authRequiredMiddleware(['editAuthors']), authorController.create);

/**
 * Update autor
 */
router.put('/', authSvc.authRequiredMiddleware(['editAuthors']), authorController.update);

/**
 * Delete autor
 */
router.delete('/:id', authSvc.authRequiredMiddleware(['editAuthors']), authorController.delete);

export default router;
