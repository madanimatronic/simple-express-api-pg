import { App } from '@/App';
import { env } from '@/config/env';
import { checkFileExistence } from '@/utils/utils';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Express } from 'express';
import mockFS from 'mock-fs';
import { Server } from 'node:http';
import path from 'node:path';
import { Pool } from 'pg';
import request from 'supertest';
import { onlySingleThumbnailFileResponse } from '../../data/api-responses';
import { testUUID } from '../../data/common';
import { testFileName } from '../../data/file-data';
import {
  createdThumbnailFilePath,
  testPostTextCreationData,
} from '../../data/post-data';
import { testUsersCreationData } from '../../data/user-data';
import { initTestDB } from '../../utils/db';

// TODO: можно добавить ещё тестов

const uuidv4Mock = jest.fn();
jest.mock('uuid', () => ({
  v4: () => {
    return uuidv4Mock.mockImplementation(() => testUUID)();
  },
}));

describe('Post Router', () => {
  jest.setTimeout(60000);

  let postgresContainer: StartedPostgreSqlContainer;
  let testPool: Pool;
  let expressApp: Express;
  let httpServer: Server;
  let authorAccessToken: string;
  let authorId: number;

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

  beforeEach(async () => {
    // Загружаем node_modules, чтобы избежать ошибок
    // (иначе некоторые части приложения могут перестать работать)
    // Также обратить внимание, что после данного вызова файловая система подменяется на
    // виртуальную, поэтому в неё нужно загрузить всё необходимое для работы заранее!
    mockFS({
      node_modules: mockFS.load(path.resolve('node_modules')),
      'test-image.jpg': mockFS.load(
        path.resolve('__tests__', 'data', 'files', 'test-image.jpg'),
      ),
      [path.resolve(env.STATIC_FOLDER_PATH)]: {},
    });
    // Создаём в БД несколько пользователей
    for (const userData of testUsersCreationData) {
      const response = await request(expressApp)
        .post('/api/auth/register')
        .send(userData);

      // Берём access токен последнего пользователя (можно и другого)
      authorAccessToken = response.body.accessToken;
      authorId = response.body.user.id;
    }
  });

  afterEach(async () => {
    mockFS.restore();
    await testPool.query(
      `TRUNCATE TABLE
      users,
      posts,
      tokens,
      email_verifications,
      user_roles
      RESTART IDENTITY CASCADE`,
    );
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await testPool.end();
    await postgresContainer.stop();
    httpServer.close();
  });

  describe('POST /posts', () => {
    describe('given valid input', () => {
      it('should create and return post with thumbnail', async () => {
        const response = await request(expressApp)
          .post('/api/posts')
          .field('title', testPostTextCreationData.title)
          .field('content', testPostTextCreationData.content)
          .attach('thumbnail', 'test-image.jpg')
          .set('Authorization', `Bearer ${authorAccessToken}`);

        const isThumbnailCreated = await checkFileExistence(
          createdThumbnailFilePath,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          ...testPostTextCreationData,
          id: 1,
          author_id: 3,
          thumbnail: testFileName,
        });
        expect(isThumbnailCreated).toBe(true);
      });

      it('should create and return post without thumbnail', async () => {
        const response = await request(expressApp)
          .post('/api/posts')
          .send(testPostTextCreationData)
          .set('Authorization', `Bearer ${authorAccessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          ...testPostTextCreationData,
          id: 1,
          author_id: authorId,
          thumbnail: null,
        });
      });
    });

    describe('given invalid input', () => {
      it('should return file limit error if more than one thumbnail is attached', async () => {
        const response = await request(expressApp)
          .post('/api/posts')
          .field('title', testPostTextCreationData.title)
          .field('content', testPostTextCreationData.content)
          .attach('thumbnail', 'test-image.jpg')
          .attach('thumbnail', 'test-image.jpg')
          .set('Authorization', `Bearer ${authorAccessToken}`);

        const isThumbnailCreated = await checkFileExistence(
          createdThumbnailFilePath,
        );

        expect(response.status).toBe(400);
        expect(response.body).toEqual(onlySingleThumbnailFileResponse);
        expect(isThumbnailCreated).toBe(false);
      });
    });
  });

  describe('DELETE /posts/:id', () => {
    beforeEach(async () => {
      // Создаём пост с thumbnail
      await request(expressApp)
        .post('/api/posts')
        .field('title', testPostTextCreationData.title)
        .field('content', testPostTextCreationData.content)
        .attach('thumbnail', 'test-image.jpg')
        .set('Authorization', `Bearer ${authorAccessToken}`);
    });

    describe('given valid input', () => {
      it('should delete post and thumbnail and return deleted post', async () => {
        // Для надёжности проверяем, что файл существует (хотя не обязательно)
        let isThumbnailFileExists = await checkFileExistence(
          createdThumbnailFilePath,
        );
        expect(isThumbnailFileExists).toBe(true);

        const response = await request(expressApp)
          .delete('/api/posts/1')
          .set('Authorization', `Bearer ${authorAccessToken}`);

        isThumbnailFileExists = await checkFileExistence(
          createdThumbnailFilePath,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          ...testPostTextCreationData,
          id: 1,
          author_id: authorId,
          thumbnail: testFileName,
        });
        expect(isThumbnailFileExists).toBe(false);
      });

      it('should delete post without thumbnail and return deleted post', async () => {
        // Создаём пост без thumbnail
        await request(expressApp)
          .post('/api/posts')
          .send(testPostTextCreationData)
          .set('Authorization', `Bearer ${authorAccessToken}`);

        const response = await request(expressApp)
          .delete('/api/posts/2')
          .set('Authorization', `Bearer ${authorAccessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          ...testPostTextCreationData,
          id: 2,
          author_id: authorId,
          thumbnail: null,
        });
      });
    });

    describe('given invalid input', () => {
      it('should return bad request error for invalid post id', async () => {
        const response = await request(expressApp)
          .delete('/api/posts/invalid-id')
          .set('Authorization', `Bearer ${authorAccessToken}`);

        expect(response.status).toBe(400);
      });
    });
  });
});
