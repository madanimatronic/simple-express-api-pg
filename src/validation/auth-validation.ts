import { z } from 'zod/v4';

export const emailSchema = z.email();
export const passwordSchema = z.string().min(6);
export const jwtSchema = z.jwt();
export const jwtPayloadSchema = z.record(z.string(), z.unknown());
