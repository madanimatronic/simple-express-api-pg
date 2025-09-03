import { UserController } from '@/controllers/UserController';
import { UserRoleController } from '@/controllers/UserRoleController';
import { InitializedOwnershipHandler } from '@/types/middleware/ownership-handler';
import { RoleHandler } from '@/types/middleware/role-handler';
import { RequestHandler, Router } from 'express';

export const createUserRouter = (
  userController: UserController,
  userRoleController: UserRoleController,
  authHandler: RequestHandler,
  roleHandler: RoleHandler,
  ownershipHandler: InitializedOwnershipHandler,
) => {
  const userRouter = Router();

  userRouter.use('/users', authHandler);

  userRouter.get('/users', userController.getAll.bind(userController));
  userRouter.get('/users/:id', userController.getById.bind(userController));
  // TODO: обновление персональных данных вроде name и about оставить тут,
  // а обновлению email и пароля место скорее в auth, поэтому нужно будет создать
  // более укзонаправленную функцию обновления.
  userRouter.put(
    '/users/:id',
    ownershipHandler('id', 'user'),
    userController.update.bind(userController),
  );
  userRouter.delete(
    '/users/:id',
    ownershipHandler('id', 'user'),
    userController.delete.bind(userController),
  );

  userRouter.use('/users/:id/roles', roleHandler(['ADMIN']));

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
