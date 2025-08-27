import { NotFoundError } from '@/errors/http-errors';
import { UserRoleServiceManager } from '@/services/UserRoleServiceManager';
import { coercedIntIdSchema } from '@/validation/common';
import {
  assignMultipleRolesSchema,
  assignRoleSchema,
} from '@/validation/role-validation';
import { Request, Response } from 'express';

export class UserRoleController {
  constructor(
    private readonly userRoleServiceManager: UserRoleServiceManager,
  ) {}

  async assignRoles(req: Request, res: Response) {
    const userId = coercedIntIdSchema.parse(req.params.id);

    let roleIds: number[] = [];

    try {
      const parseResult = assignMultipleRolesSchema.parse(req.body);
      roleIds = parseResult.roleId;
    } catch {
      const parseResult = assignRoleSchema.parse(req.body);
      roleIds = [parseResult.roleId];
    }

    const assignedRoles = await this.userRoleServiceManager.assignRolesToUser(
      userId,
      roleIds,
    );

    res.json(assignedRoles);
  }

  async getUserRoles(req: Request, res: Response) {
    const userId = coercedIntIdSchema.parse(req.params.id);

    const roles = await this.userRoleServiceManager.getUserRoles(userId);

    res.json(roles);
  }

  async updateRolesForUser(req: Request, res: Response) {
    const userId = coercedIntIdSchema.parse(req.params.id);

    const { roleId: roleIds } = assignMultipleRolesSchema.parse(req.body);

    const updatedRoles = await this.userRoleServiceManager.updateRolesForUser(
      userId,
      roleIds,
    );

    res.json(updatedRoles);
  }

  async removeRoleFromUser(req: Request, res: Response) {
    const userId = coercedIntIdSchema.parse(req.params.userId);
    const roleId = coercedIntIdSchema.parse(req.params.roleId);

    const deletedRole = await this.userRoleServiceManager.removeRoleFromUser(
      userId,
      roleId,
    );

    if (!deletedRole) {
      throw new NotFoundError({ message: 'User or role not found' });
    }

    res.json(deletedRole);
  }
}
