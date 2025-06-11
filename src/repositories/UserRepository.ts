import { pool } from '@/db';
import { User, UserCreationData } from '@/types/User';

class UserRepository {
  async create(userData: UserCreationData) {
    const { name, about, points } = userData;

    // TODO: можно использовать query builder'ы для динамических запросов вместо points || 0
    // Если points undefined -> в таблицу ставится NULL -> ошибка по ограничению NOT NULL
    const dbResponse = await pool.query<User>(
      'INSERT INTO users (name, about, points) VALUES ($1, $2, $3) RETURNING *',
      [name, about, points || 0],
    );

    return dbResponse.rows[0];
  }

  async getAll() {
    const dbResponse = await pool.query<User>('SELECT * FROM users');

    return dbResponse.rows;
  }

  async getById(id: number) {
    const dbResponse = await pool.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async update(id: number, userData: UserCreationData) {
    const { name, about, points } = userData;

    const dbResponse = await pool.query<User>(
      'UPDATE users SET name = $1, about = $2, points = $3 WHERE id = $4 RETURNING *',
      [name, about, points || 0, id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async delete(id: number) {
    const dbResponse = await pool.query<User>(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}

export const userRepository = new UserRepository();
