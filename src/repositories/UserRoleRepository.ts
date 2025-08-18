import { InternalServerError } from '@/errors/http-errors';
import { RoleFromDB, UserRoleFromDB } from '@/types/role';
import { DatabaseService } from '@/types/services/DatabaseService';

export class UserRoleRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async assignRoleToUser(userId: number, roleId: number) {
    const dbResponse = await this.dbService.query<UserRoleFromDB>(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *',
      [userId, roleId],
    );

    return dbResponse.rows[0];
  }

  async assignRolesToUser(userId: number, roleIds: number[]) {
    // Причина, по которой существуют ORM и query-builder'ы:
    // Генерирует строку формата
    // ($1, $2),
    // ($1, $3),
    // ...
    // ($1, $x)
    const valuesQueryPart = roleIds.reduce(
      (accum, _, index) =>
        accum +
        `($1, $${index + 2})` +
        (index + 1 === roleIds.length ? '' : ',\n'),
      '',
    );

    const dbResponse = await this.dbService.query<UserRoleFromDB>(
      `INSERT INTO 
        user_roles (user_id, role_id) VALUES ${valuesQueryPart}
        RETURNING *`,
      [userId, ...roleIds],
    );

    return dbResponse.rows;
  }

  async getUserRoles(userId: number) {
    const dbResponse = await this.dbService.query<UserRoleFromDB>(
      'SELECT * FROM user_roles WHERE user_id = $1',
      [userId],
    );

    return dbResponse.rows;
  }

  async getUserNamedRoles(userId: number) {
    const dbResponse = await this.dbService.query<RoleFromDB>(
      `SELECT r.* FROM
      user_roles ur JOIN roles r
      ON ur.role_id = r.id WHERE ur.user_id = $1`,
      [userId],
    );

    return dbResponse.rows;
  }

  async findUserRole(userId: number, roleId: number) {
    const dbResponse = await this.dbService.query<UserRoleFromDB>(
      'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [userId, roleId],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async updateRolesForUser(userId: number, roleIds: number[]) {
    // Транзакции делаются только индивидуальными клиентами
    const client = await this.dbService.connect();

    if (!client) {
      throw new InternalServerError({ message: 'DB client error' });
    }

    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);

      const newRoles = await this.assignRolesToUser(userId, roleIds);

      await client.query('COMMIT');

      return newRoles;
    } catch {
      await client.query('ROLLBACK');
      throw new InternalServerError({
        message: 'Roles update transaction failed',
      });
    } finally {
      client.release();
    }
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    const dbResponse = await this.dbService.query<UserRoleFromDB>(
      'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [userId, roleId],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}
