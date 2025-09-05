import { DatabaseService } from '@/types/services/DatabaseService';

// TODO: это хардкод, лучше сделать как в migrate.ts
export const initTestDB = async (testDbService: DatabaseService) => {
  await testDbService.query(
    `
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      name VARCHAR(255) NOT NULL,
      about VARCHAR(255),
      points INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS posts(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      content VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS tokens(
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      refresh_token VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_verifications(
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      verification_uuid UUID UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour')
    );

    CREATE TABLE IF NOT EXISTS roles(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_roles(
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      UNIQUE (user_id, role_id)
    );

    INSERT INTO roles (name) VALUES ('USER'), ('ADMIN') ON CONFLICT (name) DO NOTHING;
    `,
  );
};
