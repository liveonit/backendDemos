import { handleErrorAsync } from '@src/middlewares/errorsCatcher';
import { Router } from 'express';
import AuthorController from './Author.controller';

const authorController = new AuthorController();

const router = Router();

/**
 * Get author
 */
router.get('/:id', handleErrorAsync(authorController.getById));

/**
 * List autors
 */
router.get('/', handleErrorAsync(authorController.getMany));

/**
 * Create autor
 */
router.post('/', handleErrorAsync(authorController.create));

/**
 * Update autor
 */
router.put('/', handleErrorAsync(authorController.update));

/**
 * Delete autor
 */
router.delete('/:id', handleErrorAsync(authorController.delete));

export default router;
