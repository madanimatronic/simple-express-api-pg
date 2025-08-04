import { JWT } from '@/types/auth';
import { DatabaseService } from '@/types/services/DatabaseService';
import { UserTokenDataFromDB } from '@/types/user-token-data';

export class TokenRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async create(userId: number, refreshToken: JWT) {
    const dbResponse = await this.dbService.query<UserTokenDataFromDB>(
      'INSERT INTO tokens (user_id, refresh_token) VALUES ($1, $2) RETURNING *',
      [userId, refreshToken],
    );

    return dbResponse.rows[0];
  }

  async find(refreshToken: JWT) {
    const dbResponse = await this.dbService.query<UserTokenDataFromDB>(
      'SELECT * FROM tokens WHERE refresh_token = $1',
      [refreshToken],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async getById(id: number) {
    const dbResponse = await this.dbService.query<UserTokenDataFromDB>(
      'SELECT * FROM tokens WHERE id = $1',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async getByUserId(id: number) {
    const dbResponse = await this.dbService.query<UserTokenDataFromDB>(
      'SELECT * FROM tokens WHERE user_id = $1',
      [id],
    );

    // TODO: возможно в других слоях где возвращается массив стоит внедрить такую же логику
    if (!dbResponse.rowCount) {
      return null;
    }

    // TODO (feat): для реализации, где 1 пользователь имеет много refresh токенов
    // это надо будет переделать
    return dbResponse.rows[0];
  }

  // TODO (feat): в случае реализации, где 1 пользователь имеет много refresh токенов
  // этот метод станет бесполнезным
  async updateByUserId(id: number, refreshToken: JWT) {
    const dbResponse = await this.dbService.query<UserTokenDataFromDB>(
      'UPDATE tokens SET refresh_token = $1 WHERE user_id = $2 RETURNING *',
      [refreshToken, id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async delete(refreshToken: JWT) {
    const dbResponse = await this.dbService.query<UserTokenDataFromDB>(
      'DELETE FROM tokens WHERE refresh_token = $1 RETURNING *',
      [refreshToken],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async deleteByUserId(id: number) {
    const dbResponse = await this.dbService.query<UserTokenDataFromDB>(
      'DELETE FROM tokens WHERE user_id = $1 RETURNING *',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}
