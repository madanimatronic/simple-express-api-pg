import { BadRequestError, NotFoundError } from '@/errors/http-errors';
import { UserRoleRepository } from '@/repositories/UserRoleRepository';
import { RoleName } from '@/types/role';
import { RoleService } from './RoleService';
import { UserService } from './UserService';

export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async assignRoleToUser(userId: number, roleId: number) {
    return await this.userRoleRepository.assignRoleToUser(userId, roleId);
  }

  async assignRoleToUserByName(userId: number, roleName: RoleName) {
    const role = await this.roleService.findRole(roleName);

    if (!role) {
      throw new BadRequestError({ message: 'Role not found' });
    }

    return await this.userRoleRepository.assignRoleToUser(userId, role.id);
  }

  async assignRolesToUser(userId: number, roleIds: number[]) {
    // Для более информативной ошибки, если такого пользователя нет
    await this.getUser(userId);

    return await this.userRoleRepository.assignRolesToUser(userId, roleIds);
  }

  async getUserRoles(userId: number) {
    if (!userId) {
      throw new BadRequestError({ message: 'User id is missing' });
    }

    await this.getUser(userId);

    return await this.userRoleRepository.getUserRoles(userId);
  }

  async getUserNamedRoles(userId: number) {
    if (!userId) {
      throw new BadRequestError({ message: 'User id is missing' });
    }

    await this.getUser(userId);

    return await this.userRoleRepository.getUserNamedRoles(userId);
  }

  async findUserRole(userId: number, roleId: number) {
    if (!userId) {
      throw new BadRequestError({ message: 'User id is missing' });
    }

    return await this.userRoleRepository.findUserRole(userId, roleId);
  }

  async updateRolesForUser(userId: number, roleIds: number[]) {
    if (!userId) {
      throw new BadRequestError({ message: 'User id is missing' });
    }

    return await this.userRoleRepository.updateRolesForUser(userId, roleIds);
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    if (!userId) {
      throw new BadRequestError({ message: 'User id is missing' });
    }

    return await this.userRoleRepository.removeRoleFromUser(userId, roleId);
  }

  private async getUser(userId: number) {
    const user = await this.userService.getFullUserDataById(userId);
    if (!user) {
      throw new NotFoundError({ message: 'User not found' });
    }

    return user;
  }
}
