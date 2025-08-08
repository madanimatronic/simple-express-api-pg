import { RoleFromDB, RoleName } from '@/types/role';
import { DatabaseService } from '@/types/services/DatabaseService';

export class RoleRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async createRole(roleName: RoleName) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'INSERT INTO roles (name) VALUES ($1) RETURNING *',
      [roleName],
    );

    return dbResponse.rows[0];
  }

  async getAll() {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'SELECT * FROM roles',
    );

    return dbResponse.rows;
  }

  async getRoleById(id: number) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'SELECT * FROM roles WHERE id = $1',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async findRole(roleName: RoleName) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'SELECT * FROM roles WHERE name = $1',
      [roleName],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async updateRole(roleId: number, roleName: RoleName) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'UPDATE roles SET name = $1 WHERE id = $2 RETURNING *',
      [roleName, roleId],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async updateRoleByName(roleName: RoleName, newRoleName: RoleName) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'UPDATE roles SET name = $1 WHERE name = $2 RETURNING *',
      [newRoleName, roleName],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async deleteRole(roleId: number) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'DELETE FROM roles WHERE id = $1 RETURNING *',
      [roleId],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async deleteRoleByName(roleName: RoleName) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      'DELETE FROM roles WHERE name = $1 RETURNING *',
      [roleName],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}
