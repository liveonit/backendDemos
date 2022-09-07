import { NotFound } from '@src/utils/errors';
import { uuid } from '@src/utils/uuid';

/*
  ====
  This is only an example that works with local data, in the most uses cases this class is going to implement
  ORM methods or custom SQL functions to save and find information on your database.
  This is the layer to communicate your backend with your database
  ====
*/

export type IPost = {
  id: string;
  title: string;
  body: string;
};

export class Post {
  static posts: IPost[] = [
    { id: uuid(), title: 'First Post', body: 'This is the first post' },
    { id: uuid(), title: 'Second Post', body: 'This is the second post' },
  ];

  static get = () => this.posts;
  static getById = (id: string) => this.posts.find((p) => p.id === id);
  static update = (id: string, postData: Omit<IPost, 'id'>) => {
    const idx = this.posts.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.posts[idx] = { ...this.posts[idx], ...postData };
      return this.posts[idx];
    }
    throw new NotFound('Post not found');
  };
  static delete = (id: string) => {
    this.posts = this.posts.filter((p) => p.id !== id);
  };

  // adding a post
  static add = (postData: Omit<IPost, 'id'>) => {
    const newPost = { ...postData, id: uuid() };
    this.posts.push(newPost);
    return newPost;
  };
}
