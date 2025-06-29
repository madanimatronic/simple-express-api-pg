import express, { Express } from 'express';
import fileUpload from 'express-fileupload';
import { Server } from 'node:http';
import { env } from './config/env';
import { PostController } from './controllers/PostController';
import { UserController } from './controllers/UserController';
import { pool } from './db';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { PostRepository } from './repositories/PostRepository';
import { UserRepository } from './repositories/UserRepository';
import { createPostRouter } from './routes/post-routes';
import { createUserRouter } from './routes/user-routes';
import { FileService } from './services/FileService';
import { PostService } from './services/PostService';
import { UserService } from './services/UserService';
import { DatabaseService } from './types/services/DatabaseService';

export class App {
  public readonly expressApp: Express;
  private _httpServer: Server | undefined;

  // dbService передается аргументом для удобства тестирования
  constructor(private readonly dbService: DatabaseService = pool) {
    this.expressApp = express();
    this.init();
  }

  private init() {
    const fileService = new FileService();

    const userRepository = new UserRepository(this.dbService);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const postRepository = new PostRepository(this.dbService);
    const postService = new PostService(
      postRepository,
      userService,
      fileService,
    );
    const postController = new PostController(postService);

    const userRouter = createUserRouter(userController);
    const postRouter = createPostRouter(postController);

    this.expressApp.use(express.json());
    this.expressApp.use('/static', express.static('static'));
    this.expressApp.use(fileUpload());
    this.expressApp.use('/api', userRouter);
    this.expressApp.use('/api', postRouter);
    this.expressApp.use(notFoundHandler);
    this.expressApp.use(errorHandler());
  }

  start() {
    try {
      console.log('Starting server...');

      this._httpServer = this.expressApp.listen(env.APP_PORT, () => {
        console.log(`Server started on port ${env.APP_PORT}`);
      });
    } catch (err) {
      console.error(err);
    }
  }

  get httpServer() {
    return this._httpServer;
  }
}
