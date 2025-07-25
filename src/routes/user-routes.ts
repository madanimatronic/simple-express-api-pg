import { UserController } from '@/controllers/UserController';
import { Router } from 'express';

// TODO: некоторые эндпоинты (если не все) должны быть защищенными
export const createUserRouter = (userController: UserController) => {
  const userRouter = Router();

  // TODO: убрать создание пользователя (из контроллера тоже), т.к. за это отвечает auth
  //userRouter.post('/users', userController.create.bind(userController));
  userRouter.get('/users', userController.getAll.bind(userController));
  userRouter.get('/users/:id', userController.getById.bind(userController));
  userRouter.put('/users/:id', userController.update.bind(userController));
  userRouter.delete('/users/:id', userController.delete.bind(userController));

  return userRouter;
};
