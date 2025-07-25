import { z } from 'zod/v4';

export const intIdSchema = z.number().int().positive();
export const coercedIntIdSchema = z.coerce.number().int().positive();
export const uuidSchema = z.uuidv4();
