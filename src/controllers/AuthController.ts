import { env } from '@/config/env';
import { AuthService } from '@/services/AuthService';
import { uuidSchema } from '@/validation/common';
import { userCreationSchema } from '@/validation/user-validation';
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
    });

    res.json(newUserData);
  }

  async login(req: Request, res: Response) {}

  async logout(req: Request, res: Response) {}

  async verifyEmail(req: Request, res: Response) {
    const verificationUUID = uuidSchema.parse(req.params.uuid);

    await this.authService.verifyEmail(verificationUUID);

    res.redirect(env.CLIENT_EMAIL_VERIFIED_URL);
  }

  async refresh(req: Request, res: Response) {}
}
