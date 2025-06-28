import { PostController } from '@/controllers/PostController';
import { Router } from 'express';

export const createPostRouter = (postController: PostController) => {
  const postRouter = Router();

  postRouter.post('/posts', postController.create.bind(postController));
  postRouter.get('/posts', postController.getAll.bind(postController));
  postRouter.get('/posts/:id', postController.getById.bind(postController));
  postRouter.put('/posts/:id', postController.update.bind(postController));
  postRouter.delete('/posts/:id', postController.delete.bind(postController));

  return postRouter;
};
