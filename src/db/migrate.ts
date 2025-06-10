import { env } from '@/config/env';
import fs from 'fs/promises';
import path from 'node:path';
import { Pool } from 'pg';

const migrate = async () => {
  const pool = new Pool({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  });

  try {
    console.log('Starting DB migration...');
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);

    const sqlFiles = files.filter((file) => file.endsWith('.sql')).sort();

    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, { encoding: 'utf-8' });

      console.log(`Executing ${file}...`);
      await pool.query(sql);
    }

    console.log('DB migration finished successfully!');
  } catch (err) {
    console.error('DB migration failed:', err);
  } finally {
    await pool.end();
  }
};

migrate();
