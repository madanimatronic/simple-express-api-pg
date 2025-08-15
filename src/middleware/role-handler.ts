import { ForbiddenError } from '@/errors/http-errors';
import { RoleName } from '@/types/role';
import { userJwtPayloadSchema } from '@/validation/auth-validation';
import { NextFunction, Request, Response } from 'express';

// Используется только после auth middleware
export const roleHandler =
  (allowedRoles: RoleName[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roles: userRoles } = userJwtPayloadSchema.parse(req.user);

      const isUserAllowed = allowedRoles.some((role) =>
        userRoles.includes(role),
      );

      if (!isUserAllowed) {
        throw new Error();
      }

      next();
    } catch {
      throw new ForbiddenError({
        message: 'Access denied, not enough permissions',
      });
    }
  };
