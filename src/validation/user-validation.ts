import { z } from 'zod/v4';
import { intIdSchema } from './common';

export const userSchema = z.object({
  id: intIdSchema,
  name: z.string(),
  about: z.nullable(z.string()),
  points: z.number().int(),
});

export const userCreationSchema = z.object({
  name: z.string(),
  about: z.optional(z.string()),
  points: z.optional(z.coerce.number().int()),
});
