import { RoleName } from '@/types/role';
import { AuthService } from './AuthService';
import { UserRoleService } from './UserRoleService';

// Класс-декоратор, являющийся надстройкой над UserRoleService,
// добавляющий auth логику при изменении ролей пользователя.
// Нужен, чтобы избежать кольцевой зависимости между UserRoleService и AuthService
export class UserRoleServiceManager {
  constructor(
    private readonly userRoleService: UserRoleService,
    private readonly authService: AuthService,
  ) {}

  async assignRoleToUser(userId: number, roleId: number) {
    const result = await this.userRoleService.assignRoleToUser(userId, roleId);

    // Если у пользователя есть refresh-токен в БД, то вычищаем его, т.к.
    // он содержит уже устаревший payload (роли изменились)
    await this.authService.logoutByUserId(userId);

    return result;
  }

  async assignRoleToUserByName(userId: number, roleName: RoleName) {
    const result = await this.userRoleService.assignRoleToUserByName(
      userId,
      roleName,
    );

    await this.authService.logoutByUserId(userId);

    return result;
  }

  async assignRolesToUser(userId: number, roleIds: number[]) {
    const result = await this.userRoleService.assignRolesToUser(
      userId,
      roleIds,
    );

    await this.authService.logoutByUserId(userId);

    return result;
  }

  async getUserRoles(userId: number) {
    return await this.userRoleService.getUserRoles(userId);
  }

  async getUserNamedRoles(userId: number) {
    return await this.userRoleService.getUserNamedRoles(userId);
  }

  async findUserRole(userId: number, roleId: number) {
    return await this.userRoleService.findUserRole(userId, roleId);
  }

  async updateRolesForUser(userId: number, roleIds: number[]) {
    const result = await this.userRoleService.updateRolesForUser(
      userId,
      roleIds,
    );

    await this.authService.logoutByUserId(userId);

    return result;
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    const result = await this.userRoleService.removeRoleFromUser(
      userId,
      roleId,
    );

    await this.authService.logoutByUserId(userId);

    return result;
  }
}
