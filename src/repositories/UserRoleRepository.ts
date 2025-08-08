import { InternalServerError } from '@/errors/http-errors';
import { RoleName, RoleNameFromDB, UserRoleFromDB } from '@/types/role';
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

  async assignRoleToUserByRoleName(userId: number, roleName: RoleName) {
    const dbResponse = await this.dbService.query<UserRoleFromDB>(
      `INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, (SELECT id FROM roles WHERE name = $2)) RETURNING *`,
      [userId, roleName],
    );

    return dbResponse.rows[0];
  }

  async getUserRoles(userId: number) {
    const dbResponse = await this.dbService.query<RoleNameFromDB>(
      `SELECT r.name FROM
      user_roles ur JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1`,
      [userId],
    );

    const roles = dbResponse.rows.map((row) => row.name);

    return roles;
  }

  async findUserRole(userId: number, roleName: RoleName) {
    const dbResponse = await this.dbService.query<RoleNameFromDB>(
      `SELECT r.name FROM
      user_roles ur JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1 AND r.name = $2`,
      [userId, roleName],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    const role = dbResponse.rows[0].name;

    return role;
  }

  // TODO: протестировать с пустым roles, ну и протестировать всё остальное
  async updateRolesForUser(userId: number, roles: RoleName[]) {
    // Транзакции делаются только индивидуальными клиентами
    const client = await this.dbService.connect();

    if (!client) {
      throw new InternalServerError({ message: 'DB client error' });
    }

    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);

      // Причина, по которой существуют ORM и query-builder'ы:
      // Генерирует строку формата
      // ($1, $2),
      // ($1, $3),
      // ...
      // ($1, $x)
      const valuesQueryPart = roles.reduce(
        (accum, _, index) =>
          accum +
          `($1, $${index + 2})` +
          (index + 1 === roles.length ? '' : ',\n'),
        '',
      );

      const dbResponse = await client.query<UserRoleFromDB>(
        `INSERT INTO 
        user_roles (user_id, role_id) VALUES ${valuesQueryPart}
        RETURNING *`,
        [userId, ...roles],
      );

      await client.query('COMMIT');

      return dbResponse.rows;
    } catch {
      await client.query('ROLLBACK');
      throw new InternalServerError({
        message: 'Roles update transaction failed',
      });
    } finally {
      client.release();
    }
  }

  async removeRoleFromUser(userId: number, roleName: RoleName) {
    const dbResponse = await this.dbService.query<UserRoleFromDB>(
      `WITH r AS (SELECT id FROM roles WHERE name = $1)
      DELETE FROM user_roles WHERE user_id = $2
      AND role_id IN (SELECT id FROM r) RETURNING *`,
      [roleName, userId],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}
