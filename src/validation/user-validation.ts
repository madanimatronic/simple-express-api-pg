import { z } from 'zod/v4';
import { emailSchema, passwordSchema } from './auth-validation';
import { intIdSchema } from './common';

export const userSchema = z.object({
  name: z.string(),
  about: z.nullable(z.string()),
  points: z.number().int(),
  email: z.string(),
  isEmailVerified: z.boolean(),
  password: z.string(),
});

export const userCreationSchema = z.object({
  name: z.string().min(1),
  about: z.optional(z.string().min(1)),
  points: z.optional(z.coerce.number().int()),
  email: emailSchema,
  password: passwordSchema,
});

export const userFromDbSchema = z.object({
  id: intIdSchema,
  name: z.string(),
  about: z.nullable(z.string()),
  points: z.number().int(),
  email: z.string(),
  is_email_verified: z.boolean(),
  password: z.string(),
});
