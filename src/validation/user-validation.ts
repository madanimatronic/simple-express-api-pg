import { z } from 'zod/v4';
import { emailSchema, passwordSchema } from './auth-validation';
import { intIdSchema } from './common';

export const userFromDbSchema = z.object({
  id: intIdSchema,
  name: z.string(),
  about: z.nullable(z.string()),
  points: z.number().int(),
  email: emailSchema,
  is_email_verified: z.boolean(),
  password: passwordSchema,
});

export const userSchema = z.object({
  name: z.string(),
  about: z.nullable(z.string()),
  points: z.number().int(),
  email: emailSchema,
  isEmailVerified: z.boolean(),
  password: passwordSchema,
});

export const userCreationSchema = z.object({
  name: z.string().min(1),
  about: z.optional(z.string().min(1)),
  email: emailSchema,
  password: passwordSchema,
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
