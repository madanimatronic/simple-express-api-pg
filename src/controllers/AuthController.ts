import { env } from '@/config/env';
import { UnauthorizedError } from '@/errors/http-errors';
import { AuthService } from '@/services/AuthService';
import { jwtSchema } from '@/validation/auth-validation';
import { uuidSchema } from '@/validation/common';
import {
  userCreationSchema,
  userLoginSchema,
} from '@/validation/user-validation';
import { Request, Response } from 'express';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response) {
    const userData = userCreationSchema.parse(req.body);

    const newUserData = await this.authService.registerUser(userData);

    // TODO: может создать cookieService? (хотя скорее всего это лишнее)
    res.cookie('refreshToken', newUserData.refreshToken, {
      maxAge: env.COOKIE_LIFETIME,
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
    });

    res.json(newUserData);
  }

  async login(req: Request, res: Response) {
    const userLoginData = userLoginSchema.parse(req.body);

    const userData = await this.authService.login(userLoginData);

    // TODO: Избавиться от дублировния!
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: env.COOKIE_LIFETIME,
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
    });

    res.json(userData);
  }

  async logout(req: Request, res: Response) {
    const refreshToken = jwtSchema.parse(req.cookies.refreshToken);

    const tokenData = await this.authService.logout(refreshToken);

    if (!tokenData) {
      throw new UnauthorizedError({ message: 'Invalid token' });
    }

    res.clearCookie('refreshToken');

    return res.json({ result: 'success' });
  }

  async verifyEmail(req: Request, res: Response) {
    const verificationUUID = uuidSchema.parse(req.params.uuid);

    await this.authService.verifyEmail(verificationUUID);

    res.redirect(env.CLIENT_EMAIL_VERIFIED_URL);
  }

  async refresh(req: Request, res: Response) {}
}
