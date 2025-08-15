import { NotFoundError } from '@/errors/http-errors';
import { UserRoleService } from '@/services/UserRoleService';
import { coercedIntIdSchema } from '@/validation/common';
import {
  assignMultipleRolesSchema,
  assignRoleSchema,
} from '@/validation/role-validation';
import { Request, Response } from 'express';

export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

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

    const assignedRoles = await this.userRoleService.assignRolesToUser(
      userId,
      roleIds,
    );

    res.json(assignedRoles);
  }

  async getUserRoles(req: Request, res: Response) {
    const userId = coercedIntIdSchema.parse(req.params.id);

    const roles = await this.userRoleService.getUserRoles(userId);

    res.json(roles);
  }

  async updateRolesForUser(req: Request, res: Response) {
    const userId = coercedIntIdSchema.parse(req.params.id);

    const { roleId: roleIds } = assignMultipleRolesSchema.parse(req.body);

    const updatedRoles = await this.userRoleService.updateRolesForUser(
      userId,
      roleIds,
    );

    res.json(updatedRoles);
  }

  async removeRoleFromUser(req: Request, res: Response) {
    const userId = coercedIntIdSchema.parse(req.params.userId);
    const roleId = coercedIntIdSchema.parse(req.params.roleId);

    const deletedRole = await this.userRoleService.removeRoleFromUser(
      userId,
      roleId,
    );

    if (!deletedRole) {
      throw new NotFoundError({ message: 'User or role not found' });
    }

    res.json(deletedRole);
  }
}
