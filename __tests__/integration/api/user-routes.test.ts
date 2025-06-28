import { App } from '@/app';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Express } from 'express';
import { Server } from 'node:http';
import { Pool } from 'pg';
import request from 'supertest';

// TODO:
// - Реализовать тесты для эндпоинтов:
// userRouter.post('/users', userController.create);
// userRouter.get('/users', userController.getAll);
// userRouter.get('/users/:id', userController.getById);
// userRouter.put('/users/:id', userController.update);
// userRouter.delete('/users/:id', userController.delete);

describe('POST /users', () => {
  jest.setTimeout(60000);

  let postgresContainer: StartedPostgreSqlContainer;
  let testPool: Pool;
  let expressApp: Express;
  let httpServer: Server;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:17').start();

    testPool = new Pool({
      connectionString: postgresContainer.getConnectionUri(),
    });

    await testPool.query(
      `CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
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
      );`,
    );

    const app = new App(testPool);

    expressApp = app.expressApp;
    app.start();
    httpServer = app.httpServer!;
  });

  beforeEach(async () => {
    await testPool.query(
      'TRUNCATE TABLE users, posts RESTART IDENTITY CASCADE',
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await testPool.end();
    await postgresContainer.stop();
    httpServer.close();
  });

  it('should create and return new user', async () => {
    const response = await request(expressApp)
      .post('/api/users')
      .send({ name: 'First user', about: 'just a test user', points: 10 });

    expect(response.body).toEqual({
      id: 1,
      name: 'First user',
      about: 'just a test user',
      points: 10,
    });
  });
});
