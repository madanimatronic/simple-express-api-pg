import { App } from '@/App';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import bcrypt from 'bcrypt';
import { Express } from 'express';
import { Server } from 'node:http';
import { Pool } from 'pg';
import request from 'supertest';
import { userNotFoundResponse } from '../../data/api-responses';
import { testAccessJWT } from '../../data/common';
import {
  createdTestUserFromDB,
  createdTestUsersPublicData,
  hashedPassword,
  testUserCreationData,
  testUsersCreationData,
} from '../../data/user-data';
import { initTestDB } from '../../utils/db';

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

    await initTestDB(testPool);

    const app = new App(testPool);

    expressApp = app.expressApp;
    app.start();
    httpServer = app.httpServer!;
  });

  beforeEach(() => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async (pass, salt) => hashedPassword);
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

  describe('GET /users', () => {
    beforeEach(async () => {
      for (const userData of testUsersCreationData) {
        await request(expressApp).post('/api/auth/register').send(userData);
      }
    });

    it('should return all existing users', async () => {
      const response = await request(expressApp)
        .get('/api/users')
        .set('Authorization', `Bearer ${testAccessJWT}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(createdTestUsersPublicData);
    });
  });

  describe('GET /users/:id', () => {
    beforeEach(async () => {
      for (const userData of testUsersCreationData) {
        await request(expressApp).post('/api/auth/register').send(userData);
      }
    });

    describe('given valid input', () => {
      it('should return existing user', async () => {
        const response = await request(expressApp)
          .get('/api/users/1')
          .set('Authorization', `Bearer ${testAccessJWT}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(createdTestUsersPublicData[0]);
      });
    });

    describe('given invalid input', () => {
      it('should return bad request error if id is invalid', async () => {
        const response = await request(expressApp)
          .get('/api/users/invalid-id')
          .set('Authorization', `Bearer ${testAccessJWT}`);

        expect(response.status).toBe(400);
      });
    });
  });

  describe('PUT /users/:id', () => {
    beforeEach(async () => {
      await request(expressApp)
        .post('/api/auth/register')
        .send(testUserCreationData);
    });

    describe('given valid input', () => {
      it('should update and return updated user', async () => {
        const updateData = {
          name: 'updated user',
          about: 'updated info',
        };

        const response = await request(expressApp)
          .put('/api/users/1')
          .send(updateData)
          .set('Authorization', `Bearer ${testAccessJWT}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          ...createdTestUserFromDB,
          ...updateData,
        });
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
          .send(updatedUser)
          .set('Authorization', `Bearer ${testAccessJWT}`);

        expect(response.status).toBe(400);
      });
    });
  });

  describe('DELETE /users/:id', () => {
    beforeEach(async () => {
      await request(expressApp)
        .post('/api/auth/register')
        .send(testUserCreationData);
    });

    describe('given valid input', () => {
      it('should delete and return deleted user', async () => {
        const response = await request(expressApp)
          .delete('/api/users/1')
          .set('Authorization', `Bearer ${testAccessJWT}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(createdTestUserFromDB);
      });

      it('should return user not found error if user does not exist', async () => {
        const response = await request(expressApp)
          .delete('/api/users/99')
          .set('Authorization', `Bearer ${testAccessJWT}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual(userNotFoundResponse);
      });
    });

    describe('given invalid input', () => {
      it('should return bad request error for invalid data', async () => {
        const response = await request(expressApp)
          .delete('/api/users/invalid-id')
          .set('Authorization', `Bearer ${testAccessJWT}`);

        expect(response.status).toBe(400);
      });
    });
  });
});
