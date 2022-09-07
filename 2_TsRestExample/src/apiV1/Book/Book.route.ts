import { handleErrorAsync } from '@src/middlewares/errorsCatcher';
import { Router } from 'express';
import BookController from './Book.controller';

const bookController = new BookController();

const router = Router();

/**
 * Get book
 */
router.get('/:id', handleErrorAsync(bookController.getById));

/**
 * List autors
 */
router.get('/', handleErrorAsync(bookController.getMany));

/**
 * Create autor
 */
router.post('/', handleErrorAsync(bookController.create));

/**
 * Update autor
 */
router.put('/', handleErrorAsync(bookController.create));

/**
 * Delete autor
 */
router.delete('/:id', handleErrorAsync(bookController.delete));

export default router;
