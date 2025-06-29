import { App } from '@/App';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Express } from 'express';
import { Server } from 'node:http';
import { Pool } from 'pg';
import request from 'supertest';
import {
  invalidInputResponse,
  userNotFoundResponse,
} from '../../data/api-responses';
import {
  createdTestUsers,
  testUserData,
  testUsersData,
} from '../../data/user-data';

describe('User Router', () => {
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

  afterEach(async () => {
    await testPool.query(
      'TRUNCATE TABLE users, posts RESTART IDENTITY CASCADE',
    );
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await testPool.end();
    await postgresContainer.stop();
    httpServer.close();
  });

  describe('POST /users', () => {
    describe('given valid input', () => {
      it('should create and return new user', async () => {
        const response = await request(expressApp)
          .post('/api/users')
          .send(testUserData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: 1,
          ...testUserData,
        });
      });

      it('should create and return new user if minimal data provided', async () => {
        const response = await request(expressApp)
          .post('/api/users')
          .send({ name: testUserData.name });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: 1,
          name: testUserData.name,
          about: null,
          points: 0,
        });
      });

      it('should create and return new user if some users already exist', async () => {
        for (const userData of testUsersData) {
          await request(expressApp).post('/api/users').send(userData);
        }

        const response = await request(expressApp)
          .post('/api/users')
          .send(testUserData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: 4,
          ...testUserData,
        });
      });
    });

    describe('given invalid input', () => {
      it('should return bad request error for invalid request', async () => {
        const response = await request(expressApp)
          .post('/api/users')
          .send({ about: testUserData.about, points: testUserData.points });

        expect(response.status).toBe(400);
        expect(response.body).toEqual(invalidInputResponse);
      });

      it('should return bad request error if points is not int', async () => {
        const response = await request(expressApp)
          .post('/api/users')
          .send({
            ...testUserData,
            points: 10.55,
          });

        expect(response.status).toBe(400);
        expect(response.body).toEqual(invalidInputResponse);
      });
    });
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      for (const userData of testUsersData) {
        await request(expressApp).post('/api/users').send(userData);
      }
    });

    it('should return all existing users', async () => {
      const response = await request(expressApp).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(createdTestUsers);
    });
  });

  describe('GET /users/:id', () => {
    beforeEach(async () => {
      for (const userData of testUsersData) {
        await request(expressApp).post('/api/users').send(userData);
      }
    });

    describe('given valid input', () => {
      it('should return existing user', async () => {
        const response = await request(expressApp).get('/api/users/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(createdTestUsers[0]);
      });
    });

    describe('given invalid input', () => {
      it('should return bad request error if id is invalid', async () => {
        const response = await request(expressApp).get('/api/users/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body).toEqual(invalidInputResponse);
      });
    });
  });

  describe('PUT /users/:id', () => {
    beforeEach(async () => {
      await request(expressApp).post('/api/users').send(testUserData);
    });

    describe('given valid input', () => {
      it('should update and return updated user', async () => {
        const updatedUser = {
          name: 'updated user',
          about: 'updated info',
          points: 900,
        };

        const response = await request(expressApp)
          .put('/api/users/1')
          .send(updatedUser);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, ...updatedUser });
      });
    });

    describe('given invalid input', () => {
      it('should return bad request error for invalid data', async () => {
        const updatedUser = {
          name: 'updated user',
          about: 'updated info',
          points: 'invalid-data',
        };

        const response = await request(expressApp)
          .put('/api/users/1')
          .send(updatedUser);

        expect(response.status).toBe(400);
        expect(response.body).toEqual(invalidInputResponse);
      });
    });
  });

  describe('DELETE /users/:id', () => {
    beforeEach(async () => {
      await request(expressApp).post('/api/users').send(testUserData);
    });

    describe('given valid input', () => {
      it('should delete and return deleted user', async () => {
        const response = await request(expressApp).delete('/api/users/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, ...testUserData });
      });

      it('should return user not found error if user does not exist', async () => {
        const response = await request(expressApp).delete('/api/users/99');

        expect(response.status).toBe(404);
        expect(response.body).toEqual(userNotFoundResponse);
      });
    });

    describe('given invalid input', () => {
      it('should return bad request error for invalid data', async () => {
        const response = await request(expressApp).delete(
          '/api/users/invalid-id',
        );

        expect(response.status).toBe(400);
        expect(response.body).toEqual(invalidInputResponse);
      });
    });
  });
});
