import { PostController } from '@src/controllers/PostController';
import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { Router } from 'express';

const postRouter = Router();
postRouter.get('/', handleErrorAsync(PostController.getPosts));
postRouter.get('/:id', handleErrorAsync(PostController.getPost));
postRouter.put('/:id', handleErrorAsync(PostController.updatePost));
postRouter.delete('/:id', handleErrorAsync(PostController.deletePost));
postRouter.post('/', handleErrorAsync(PostController.addPost));

export { postRouter };
