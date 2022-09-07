import { Router } from 'express';
import userRoute from './User/User.route';
import bookRoute from './Book/Book.route';
import authorRoute from './Author/Author.route';

const router: Router = Router();

router.use('/user', userRoute)
router.use('/book', bookRoute);
router.use('/author', authorRoute);

export default router;
