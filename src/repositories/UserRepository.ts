import { Email } from '@/types/auth';
import { DatabaseService } from '@/types/services/DatabaseService';
import { User, UserCreationData, UserFromDB } from '@/types/User';
import { generateDynamicUpdateQueryPart } from '@/utils/helpers';

export class UserRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async create(userData: UserCreationData) {
    const { name, email, password, about } = userData;

    const dbResponse = await this.dbService.query<UserFromDB>(
      `INSERT INTO users (name, email, password, about) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, password, about],
    );

    return dbResponse.rows[0];
  }

  async getAll() {
    const dbResponse = await this.dbService.query<UserFromDB>(
      'SELECT * FROM users',
    );

    return dbResponse.rows;
  }

  async getById(id: number) {
    const dbResponse = await this.dbService.query<UserFromDB>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async getByEmail(email: Email) {
    const dbResponse = await this.dbService.query<UserFromDB>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async update(id: number, userData: Partial<User>) {
    const { isEmailVerified, ...otherUserData } = userData;

    // Столбцы в БД иногда имеют отличающееся название,
    // например is_email_verified вместо isEmailVerified,
    // поэтому нужен маппинг, ибо дальше динамический запрос
    // будет формироваться на основе маппинг-объекта
    const dbMappedUserData = {
      ...otherUserData,
      is_email_verified: isEmailVerified,
    };

    const { updateFieldsQueryPart, updateValues, lastUpdateValueIndex } =
      generateDynamicUpdateQueryPart(dbMappedUserData);

    const dbResponse = await this.dbService.query<UserFromDB>(
      `UPDATE users SET
      ${updateFieldsQueryPart}
      WHERE id = $${lastUpdateValueIndex + 1}
      RETURNING *`,
      [...updateValues, id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async delete(id: number) {
    const dbResponse = await this.dbService.query<UserFromDB>(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}
