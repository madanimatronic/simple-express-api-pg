import { z } from 'zod/v4';
import { jwtSchema } from './auth-validation';
import { intIdSchema } from './common';

export const userTokenDataFromDbSchema = z.object({
  id: intIdSchema,
  user_id: intIdSchema,
  refresh_token: jwtSchema,
});

export const userTokenDataSchema = z.object({
  userId: intIdSchema,
  refreshToken: jwtSchema,
});
