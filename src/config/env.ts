import 'dotenv/config';
import { z } from 'zod/v4';

const envSchema = z.object({
  NODE_ENV: z.string(),
  APP_PORT: z.coerce.number(),
  STATIC_FOLDER_PATH: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

export const env = envSchema.parse(process.env, {
  error: (iss) => 'Some .env variables are invalid!',
});
