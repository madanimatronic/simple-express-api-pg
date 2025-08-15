import { UserController } from '@/controllers/UserController';
import { UserRoleController } from '@/controllers/UserRoleController';
import { Router } from 'express';

export const createUserRouter = (
  userController: UserController,
  userRoleController: UserRoleController,
) => {
  const userRouter = Router();

  userRouter.get('/users', userController.getAll.bind(userController));
  userRouter.get('/users/:id', userController.getById.bind(userController));
  userRouter.put('/users/:id', userController.update.bind(userController));
  userRouter.delete('/users/:id', userController.delete.bind(userController));

  userRouter.post(
    '/users/:id/roles',
    userRoleController.assignRoles.bind(userRoleController),
  );
  userRouter.get(
    '/users/:id/roles',
    userRoleController.getUserRoles.bind(userRoleController),
  );
  userRouter.put(
    '/users/:id/roles',
    userRoleController.updateRolesForUser.bind(userRoleController),
  );
  userRouter.delete(
    '/users/:userId/roles/:roleId',
    userRoleController.removeRoleFromUser.bind(userRoleController),
  );

  return userRouter;
};
