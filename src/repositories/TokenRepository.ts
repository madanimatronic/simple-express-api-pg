import { JWT } from '@/types/auth';
import { DatabaseService } from '@/types/services/DatabaseService';

// TODO: написать типы для значений из БД
export class TokenRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async create(userId: number, refreshToken: JWT) {
    const dbResponse = await this.dbService.query(
      'INSERT INTO tokens (user_id, refresh_token) VALUES ($1, $2) RETURNING *',
      [userId, refreshToken],
    );

    return dbResponse.rows[0];
  }

  async getById(id: number) {
    const dbResponse = await this.dbService.query(
      'SELECT * FROM tokens WHERE id = $1',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async getByUserId(id: number) {
    const dbResponse = await this.dbService.query(
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
    const dbResponse = await this.dbService.query(
      'UPDATE tokens SET refresh_token = $1 WHERE user_id = $2 RETURNING *',
      [refreshToken, id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}
