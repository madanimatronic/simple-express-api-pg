import { userController } from '@/controllers/UserController';
import { Router } from 'express';

export const userRouter = Router();

userRouter.post('/users', userController.create);
userRouter.get('/users', userController.getAll);
userRouter.get('/users/:id', userController.getById);
userRouter.put('/users/:id', userController.update);
userRouter.delete('/users/:id', userController.delete);
