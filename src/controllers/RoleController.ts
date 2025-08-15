import { NotFoundError } from '@/errors/http-errors';
import { RoleService } from '@/services/RoleService';
import { coercedIntIdSchema } from '@/validation/common';
import { roleCreationSchema } from '@/validation/role-validation';
import { Request, Response } from 'express';

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  async create(req: Request, res: Response) {
    const { name } = roleCreationSchema.parse(req.body);

    const newRole = await this.roleService.createRole(name);

    res.json(newRole);
  }

  async getAll(req: Request, res: Response) {
    const roles = await this.roleService.getAll();

    res.json(roles);
  }

  async getById(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const role = await this.roleService.getRoleById(id);

    if (!role) {
      throw new NotFoundError({ message: 'Role not found' });
    }

    res.json(role);
  }

  async update(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);
    const { name } = roleCreationSchema.parse(req.body);

    const updatedRole = await this.roleService.updateRole(id, name);

    if (!updatedRole) {
      throw new NotFoundError({ message: 'Role not found' });
    }

    res.json(updatedRole);
  }

  async delete(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const deletedRole = await this.roleService.getRoleById(id);

    if (!deletedRole) {
      throw new NotFoundError({ message: 'Role not found' });
    }

    res.json(deletedRole);
  }
}
