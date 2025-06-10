import { pool } from '@/db';
import { Post, PostCreationDataWithThumbnail } from '@/types/Post';

class PostRepository {
  async create(postData: PostCreationDataWithThumbnail) {
    const { title, authorId, content, thumbnail } = postData;

    const dbResponse = await pool.query<Post>(
      'INSERT INTO posts (title, author_id, content, thumbnail) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, authorId, content, thumbnail],
    );

    return dbResponse.rows[0];
  }

  async getAll() {
    const dbResponse = await pool.query<Post>('SELECT * FROM posts');

    return dbResponse.rows;
  }

  async getById(id: number) {
    const dbResponse = await pool.query<Post>(
      'SELECT * FROM posts WHERE id = $1',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async getAllByUserId(id: number) {
    const dbResponse = await pool.query<Post>(
      'SELECT * FROM posts WHERE author_id = $1',
      [id],
    );

    return dbResponse.rows;
  }

  async update(id: number, postData: PostCreationDataWithThumbnail) {
    const { title, authorId, content, thumbnail } = postData;

    const dbResponse = await pool.query<Post>(
      'UPDATE posts SET title = $1, author_id = $2, content = $3, thumbnail = $4 WHERE id = $5 RETURNING *',
      [title, authorId, content, thumbnail, id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async delete(id: number) {
    const dbResponse = await pool.query<Post>(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }
}

export const postRepository = new PostRepository();
