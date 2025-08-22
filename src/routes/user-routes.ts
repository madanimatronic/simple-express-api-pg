import { UserController } from '@/controllers/UserController';
import { UserRoleController } from '@/controllers/UserRoleController';
import { RoleHandler } from '@/types/middleware/RoleHandler';
import { RequestHandler, Router } from 'express';

export const createUserRouter = (
  userController: UserController,
  userRoleController: UserRoleController,
  authHandler: RequestHandler,
  roleHandler: RoleHandler,
) => {
  const userRouter = Router();

  userRouter.use(authHandler);

  // TODO: получение пользователей можно сделать только авторизованным пользователям
  userRouter.get('/users', userController.getAll.bind(userController));
  userRouter.get('/users/:id', userController.getById.bind(userController));
  // TODO: обновление персональных данных вроде name и about оставить тут,
  // а обновлению email и пароля место скорее в auth, поэтому нужно будет создать
  // более укзонаправленную функцию обновления.
  // Также полный update и т.п. можно оставить только для админов
  // TODO: также обязательно делать проверку, что пользователь меняет, удаляет и т.п. свой аккаунт
  userRouter.put('/users/:id', userController.update.bind(userController));
  userRouter.delete('/users/:id', userController.delete.bind(userController));

  userRouter.use(roleHandler(['ADMIN']));

  // TODO: роли пользователя управляются админами
  // ВАЖНО: Когда меняем роли пользователя нужно инвалидировать refresh token! Нужно logout делать
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
  // TODO: аналогично продумать посты и остальные роутеры

  return userRouter;
};
