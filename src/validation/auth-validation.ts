import { z } from 'zod/v4';
import { intIdSchema } from './common';

export const emailSchema = z.email();
export const passwordSchema = z.string().min(6);
export const jwtSchema = z.jwt();
export const jwtPayloadSchema = z.record(z.string(), z.unknown());
export const userJwtPayloadSchema = z.object({
  id: intIdSchema,
  email: emailSchema,
  isEmailVerified: z.boolean(),
});
