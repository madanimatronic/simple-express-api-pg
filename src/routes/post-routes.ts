import { postController } from '@/controllers/PostController';
import { Router } from 'express';

export const postRouter = Router();

postRouter.post('/posts', postController.create);
postRouter.get('/posts', postController.getAll);
postRouter.get('/posts/:id', postController.getById);
postRouter.put('/posts/:id', postController.update);
postRouter.delete('/posts/:id', postController.delete);
