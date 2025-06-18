import { userCreationSchema, userSchema } from '@/validation/user-validation';
import { z } from 'zod/v4';

export type User = z.infer<typeof userSchema>;
export type UserCreationData = z.infer<typeof userCreationSchema>;
