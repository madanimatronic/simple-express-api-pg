import {
  userCreationSchema,
  userFromDbSchema,
  userLoginSchema,
  userSchema,
} from '@/validation/user-validation';
import { z } from 'zod/v4';

export type UserFromDB = z.infer<typeof userFromDbSchema>;
export type User = z.infer<typeof userSchema>;
export type UserCreationData = z.infer<typeof userCreationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
