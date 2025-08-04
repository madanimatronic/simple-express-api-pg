import {
  emailVerificationDataFromDbSchema,
  emailVerificationDataSchema,
} from '@/validation/email-verification-data-validation';
import { z } from 'zod/v4';

export type EmailVerificationDataFromDB = z.infer<
  typeof emailVerificationDataFromDbSchema
>;
export type EmailVerificationData = z.infer<typeof emailVerificationDataSchema>;
