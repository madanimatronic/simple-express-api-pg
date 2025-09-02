import { PostController } from '@/controllers/PostController';
import { InitializedOwnershipHandler } from '@/types/middleware/ownership-handler';
import { RequestHandler, Router } from 'express';

export const createPostRouter = (
  postController: PostController,
  authHandler: RequestHandler,
  ownershipHandler: InitializedOwnershipHandler,
) => {
  const postRouter = Router();

  postRouter.get('/posts', postController.getAll.bind(postController));
  postRouter.get('/posts/:id', postController.getById.bind(postController));

  postRouter.use('/posts', authHandler);

  postRouter.post('/posts', postController.create.bind(postController));

  postRouter.use('/posts/:id', ownershipHandler('id', 'post'));

  postRouter.put('/posts/:id', postController.update.bind(postController));
  postRouter.delete('/posts/:id', postController.delete.bind(postController));

  return postRouter;
};
