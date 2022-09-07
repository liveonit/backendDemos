import { IPost, Post } from '@src/models/PostModel';

import { BadRequest } from '@utils/errors';
class PostService {
  getPosts = () => {
    // === Add business logic ===
    return Post.get();
  };

  getPost = (id: string) => {
    // === Add business logic ===
    if (!id) throw new BadRequest('Id is required');
    return Post.getById(id);
  };

  updatePost = (id: string, postData: Omit<IPost, 'id'>) => {
    // === Add business logic ===
    if (!id) throw new BadRequest('Id is required');
    return Post.update(id, postData);
  };

  deletePost = (id: string) => {
    // === Add business logic ===
    if (!id) throw new BadRequest('Id is required');
    return Post.delete(id);
  };

  addPost = (postData: Omit<IPost, 'id'>) => {
    // === Add business logic ===
    return Post.add(postData);
  };
}

export const postService = new PostService();
