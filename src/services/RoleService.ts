import { BadRequestError } from '@/errors/http-errors';
import { RoleRepository } from '@/repositories/RoleRepository';
import { RoleName } from '@/types/role';

export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(roleName: RoleName) {
    return await this.roleRepository.createRole(roleName);
  }

  async getAll() {
    return await this.roleRepository.getAll();
  }

  async getRoleById(id: number) {
    if (!id) {
      throw new BadRequestError({ message: 'Id is missing' });
    }

    return await this.roleRepository.getRoleById(id);
  }

  async findRole(name: RoleName) {
    if (!name) {
      throw new BadRequestError({ message: 'Name is missing' });
    }

    return await this.roleRepository.findRole(name);
  }

  async updateRole(roleId: number, roleName: RoleName) {
    if (!roleId) {
      throw new BadRequestError({ message: 'Id is missing' });
    }

    return await this.roleRepository.updateRole(roleId, roleName);
  }

  async deleteRole(roleId: number) {
    if (!roleId) {
      throw new BadRequestError({ message: 'Id is missing' });
    }

    return await this.roleRepository.deleteRole(roleId);
  }
}
