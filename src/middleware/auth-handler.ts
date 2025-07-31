import { UnauthorizedError } from '@/errors/http-errors';
import { TokenService } from '@/services/TokenService';
import {
  authHeaderSchema,
  jwtSchema,
  userJwtPayloadSchema,
} from '@/validation/auth-validation';
import { NextFunction, Request, Response } from 'express';

export const authHandler =
  (tokenService: TokenService) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = authHeaderSchema.parse(req.headers.authorization);
      const accessToken = jwtSchema.parse(authHeader.split(' ')[1]);

      const tokenPayload = tokenService.verifyAccessToken(accessToken);
      const userData = userJwtPayloadSchema.parse(tokenPayload);

      req.user = userData;

      next();
    } catch {
      throw new UnauthorizedError({ message: 'Invalid access token' });
    }
  };
