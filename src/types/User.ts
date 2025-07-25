import {
  userCreationSchema,
  userFromDbSchema,
  userSchema,
} from '@/validation/user-validation';
import { z } from 'zod/v4';

export type User = z.infer<typeof userSchema>;
export type UserCreationData = z.infer<typeof userCreationSchema>;
export type UserFromDB = z.infer<typeof userFromDbSchema>;
