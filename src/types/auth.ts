import {
  emailSchema,
  jwtPayloadSchema,
  jwtSchema,
  passwordSchema,
  userJwtPayloadSchema,
} from '@/validation/auth-validation';
import { SignOptions } from 'jsonwebtoken';
import { z } from 'zod/v4';

export type Email = z.infer<typeof emailSchema>;
export type Password = z.infer<typeof passwordSchema>;

export type JWT = z.infer<typeof jwtSchema>;
export type JWTPayload = z.infer<typeof jwtPayloadSchema>;
export type UserJWTPayload = z.infer<typeof userJwtPayloadSchema>;
// Валидация строки-значения времени из jsonwebtoken, достаточно сложна,
// поэтому используется данный тип для type assertion в местах где устанавливается expiresIn
export type JWTLifetimeString = Extract<SignOptions['expiresIn'], string>;
