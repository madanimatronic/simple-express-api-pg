import { App } from '@/app';
import { Express } from 'express';
import { Server } from 'node:http';
import request from 'supertest';

const notFoundResponse = { error: 'Not Found' };

describe('API Errors', () => {
  let expressApp: Express;
  let httpServer: Server;

  beforeAll(async () => {
    const app = new App();

    expressApp = app.expressApp;
    app.start();
    httpServer = app.httpServer!;
  });

  afterAll(async () => {
    httpServer.close();
  });

  it('should return not found error for non-existent endpoint', async () => {
    const response = await request(expressApp).get('/some/non/existent/path');

    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundResponse);
  });
});
