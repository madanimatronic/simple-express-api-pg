import { AuthController } from '@/controllers/AuthController';
import { RequestHandler, Router } from 'express';

export const createAuthRouter = (
  authController: AuthController,
  authHandler: RequestHandler,
) => {
  const authRouter = Router();

  authRouter.post('/register', authController.register.bind(authController));
  authRouter.post('/login', authController.login.bind(authController));
  authRouter.post('/logout', authController.logout.bind(authController));
  authRouter.get(
    '/verify-email/:uuid',
    authController.verifyEmail.bind(authController),
  );
  authRouter.post('/refresh', authController.refresh.bind(authController));
  authRouter.post(
    '/initiate-email-verification',
    authHandler,
    authController.initiateEmailVerification.bind(authController),
  );

  return authRouter;
};
