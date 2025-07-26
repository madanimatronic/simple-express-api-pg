import 'dotenv/config';
import { z } from 'zod/v4';

const envSchema = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
  APP_NAME: z.string(),
  CLIENT_HOME_URL: z.string(),
  CLIENT_EMAIL_VERIFIED_URL: z.string(),
  API_PORT: z.coerce.number(),
  API_URL: z.string(),
  STATIC_FOLDER_PATH: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_LIFETIME: z.string(),
  JWT_REFRESH_LIFETIME: z.string(),
  COOKIE_LIFETIME: z.coerce.number(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

export const env = envSchema.parse(process.env, {
  error: (iss) => 'Some .env variables are invalid!',
});
