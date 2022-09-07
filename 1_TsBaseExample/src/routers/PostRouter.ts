import { PostController } from '@src/controllers/PostController';
import { Router } from 'express';

const postRouter = Router();
postRouter.get('/', PostController.getPosts);
postRouter.get('/:id', PostController.getPost);
postRouter.put('/:id', PostController.updatePost);
postRouter.delete('/:id', PostController.deletePost);
postRouter.post('/', PostController.addPost);

export { postRouter };
