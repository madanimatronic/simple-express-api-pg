import { RoleController } from '@/controllers/RoleController';
import { Router } from 'express';

export const createRoleRouter = (roleController: RoleController) => {
  const roleRouter = Router();

  roleRouter.post('/roles', roleController.create.bind(roleController));
  roleRouter.get('/roles', roleController.getAll.bind(roleController));
  roleRouter.get('/roles/:id', roleController.getById.bind(roleController));
  roleRouter.put('/roles/:id', roleController.update.bind(roleController));
  roleRouter.delete('/roles/:id', roleController.delete.bind(roleController));

  return roleRouter;
};
