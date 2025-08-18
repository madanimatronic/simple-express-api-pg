import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import fileUpload from 'express-fileupload';
import { Server } from 'node:http';
import { env } from './config/env';
import { AuthController } from './controllers/AuthController';
import { PostController } from './controllers/PostController';
import { RoleController } from './controllers/RoleController';
import { UserController } from './controllers/UserController';
import { UserRoleController } from './controllers/UserRoleController';
import { pool } from './db';
import { authHandler } from './middleware/auth-handler';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { roleHandler } from './middleware/role-handler';
import { AuthRepository } from './repositories/AuthRepository';
import { PostRepository } from './repositories/PostRepository';
import { RoleRepository } from './repositories/RoleRepository';
import { TokenRepository } from './repositories/TokenRepository';
import { UserRepository } from './repositories/UserRepository';
import { UserRoleRepository } from './repositories/UserRoleRepository';
import { createAuthRouter } from './routes/auth-routes';
import { createPostRouter } from './routes/post-routes';
import { createRoleRouter } from './routes/role-routes';
import { createUserRouter } from './routes/user-routes';
import { AuthService } from './services/AuthService';
import { EmailService } from './services/EmailService';
import { FileService } from './services/FileService';
import { PostService } from './services/PostService';
import { RoleService } from './services/RoleService';
import { TokenService } from './services/TokenService';
import { UserRoleService } from './services/UserRoleService';
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

    const emailService = new EmailService();

    const tokenRepository = new TokenRepository(this.dbService);
    const tokenService = new TokenService(tokenRepository);

    const roleRepository = new RoleRepository(this.dbService);
    const roleService = new RoleService(roleRepository);
    const roleController = new RoleController(roleService);

    const userRoleRepository = new UserRoleRepository(this.dbService);
    const userRoleService = new UserRoleService(
      userRoleRepository,
      roleService,
    );
    const userRoleController = new UserRoleController(userRoleService);

    const authRepository = new AuthRepository(this.dbService);
    const authService = new AuthService(
      authRepository,
      userService,
      tokenService,
      emailService,
      userRoleService,
    );
    const authController = new AuthController(authService);

    const authMiddleware = authHandler(tokenService);

    const userRouter = createUserRouter(userController, userRoleController);
    const postRouter = createPostRouter(postController);
    const authRouter = createAuthRouter(authController, authMiddleware);
    const roleRouter = createRoleRouter(roleController);

    this.expressApp.use(express.json());
    this.expressApp.use(cookieParser());
    this.expressApp.use(cors());
    this.expressApp.use('/static', express.static('static'));
    this.expressApp.use(fileUpload());
    this.expressApp.use('/api/auth', authRouter);
    // TODO: Данный вариант для теста, сделать authHandler на уровне роутеров
    // TODO: Добавить проверку ролей в некоторые эндпоинты user'а
    this.expressApp.use('/api', authMiddleware, userRouter);
    this.expressApp.use('/api', authMiddleware, postRouter);
    this.expressApp.use(
      '/api',
      authMiddleware,
      roleHandler(['ADMIN']),
      roleRouter,
    );
    this.expressApp.use(notFoundHandler);
    this.expressApp.use(errorHandler());
  }

  start() {
    try {
      console.log('Starting server...');

      this._httpServer = this.expressApp.listen(env.API_PORT, () => {
        console.log(`Server started on port ${env.API_PORT}`);
      });
    } catch (err) {
      console.error(err);
    }
  }

  get httpServer() {
    return this._httpServer;
  }
}
