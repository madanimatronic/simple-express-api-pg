import { Email } from '@/types/auth';
import { DatabaseService } from '@/types/services/DatabaseService';
import { User, UserCreationData, UserFromDB } from '@/types/User';

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

  // Частичное обновление было бы более гибким
  async update(id: number, userData: User) {
    const { name, email, password, about, points, isEmailVerified } = userData;

    const dbResponse = await this.dbService.query<UserFromDB>(
      `UPDATE users SET 
      name = $1, 
      email = $2, 
      password = $3, 
      about = $4, 
      points = $5, 
      is_email_verified = $6 
      WHERE id = $7 
      RETURNING *`,
      [name, email, password, about, points, isEmailVerified, id],
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
