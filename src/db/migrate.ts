import { env } from '@/config/env';
import fs from 'fs/promises';
import path from 'node:path';
import { Pool } from 'pg';

const executeSqlInFolder = async (actionName: string, folderName: string) => {
  const pool = new Pool({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  });

  try {
    console.log(`Starting ${actionName}...`);
    const sqlDir = path.join(__dirname, folderName);
    const files = await fs.readdir(sqlDir);

    const sqlFiles = files.filter((file) => file.endsWith('.sql')).sort();

    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      const sql = await fs.readFile(filePath, { encoding: 'utf-8' });

      console.log(`Executing ${file}...`);
      await pool.query(sql);
    }

    console.log(`${actionName} finished successfully!`);
  } catch (err) {
    console.error(`${actionName} failed:`, err);
  } finally {
    await pool.end();
  }
};

const migrate = async () => {
  await executeSqlInFolder('DB migration', 'migrations');
};

const seed = async () => {
  await executeSqlInFolder('DB seeding', 'seeds');
};

const buildDB = async () => {
  await migrate();
  await seed();
};

buildDB();
