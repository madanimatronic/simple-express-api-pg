import { z } from 'zod/v4';
import { coercedDateSchema, intIdSchema, uuidSchema } from './common';

export const emailVerificationDataFromDbSchema = z.object({
  id: intIdSchema,
  user_id: intIdSchema,
  verification_uuid: uuidSchema,
  created_at: coercedDateSchema,
  expires_at: coercedDateSchema,
});

export const emailVerificationDataSchema = z.object({
  userId: intIdSchema,
  verificationUUID: uuidSchema,
  createdAt: coercedDateSchema,
  expiresAt: coercedDateSchema,
});
