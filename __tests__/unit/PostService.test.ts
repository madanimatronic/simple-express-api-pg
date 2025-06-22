import { pool } from '@/db';
import { postService } from '@/services/PostService';

describe('PostService', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('getAll', () => {
    it('should return not null response', async () => {
      const result = await postService.getAll();
      expect(result).not.toBe(null);
    });
  });
});
