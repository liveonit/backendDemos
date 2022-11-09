import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const configSchema = z.object({
  ENVIRONMENT: z.enum(['development', 'staging', 'testing', 'production']),
  PROJECT_NAME: z.string(),
  DB_HOST: z.string(),
  DB_VENDOR: z.string(),
  DB_PORT: z.string().transform((v) => +v),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  API_PORT: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().transform((v) => +v),
  REFRESH_TOKEN_EXPIRES_IN: z.string().transform((v) => +v),
  ACCESS_TOKEN_PRIVATE_KEY: z.string(),
  ACCESS_TOKEN_PUBLIC_KEY: z.string(),
  REFRESH_TOKEN_PRIVATE_KEY: z.string(),
  REFRESH_TOKEN_PUBLIC_KEY: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform((v) => +v),
  REDIS_PASSWORD: z.string(),
});
export type ConfigType = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);
