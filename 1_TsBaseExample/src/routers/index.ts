import { Router } from "express";
import { postRouter } from "./PostRouter";

const router = Router();

router.use('/post', postRouter);

export { router };
