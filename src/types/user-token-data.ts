import {
  userTokenDataFromDbSchema,
  userTokenDataSchema,
} from '@/validation/user-token-data-validation';
import { z } from 'zod/v4';

export type UserTokenDataFromDB = z.infer<typeof userTokenDataFromDbSchema>;
export type UserTokenData = z.infer<typeof userTokenDataSchema>;
