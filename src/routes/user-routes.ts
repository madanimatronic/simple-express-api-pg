import { UserController } from '@/controllers/UserController';
import { Router } from 'express';

export const createUserRouter = (userController: UserController) => {
  const userRouter = Router();

  userRouter.get('/users', userController.getAll.bind(userController));
  userRouter.get('/users/:id', userController.getById.bind(userController));
  userRouter.put('/users/:id', userController.update.bind(userController));
  userRouter.delete('/users/:id', userController.delete.bind(userController));

  return userRouter;
};
