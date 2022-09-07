import { postService } from '@src/services/PostService';
import { Request, Response } from 'express';

export class PostController {
  static getPosts = async (_req: Request, res: Response) => {
    // === Here should be the request validations ===
    return res.status(200).json({
      data: postService.getPosts(),
    });
  };

  static getPost = async (req: Request, res: Response) => {
    // === Here should be the request validations ===
    const id: string = req.params.id;
    const post = postService.getPost(id);
    return res.status(200).json({
      data: post,
    });
  };

  static updatePost = async (req: Request, res: Response) => {
    // === Here should be the request validations ===
    const id: string = req.params.id;
    const title: string = req.body.title ?? null;
    const body: string = req.body.body ?? null;
    const updatedPost = postService.updatePost(id, { title, body });
    return res.status(200).json({
      data: updatedPost,
    });
  };

  static deletePost = async (req: Request, res: Response) => {
    // === Here should be the request validations ===
    const id: string = req.params.id;
    postService.deletePost(id);
    return res.status(200).json();
  };

  static addPost = async (req: Request, res: Response) => {
    // === Here should be the request validations ===
    const title: string = req.body.title;
    const body: string = req.body.body;
    const post = postService.addPost({ title, body });
    return res.status(200).json({
      data: post,
    });
  };
}
