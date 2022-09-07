import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvironmentScheme = z.enum(['development', 'testing', 'staging', 'production']);
export type EnvType = z.infer<typeof EnvironmentScheme>;

const Config = z.object({
  ENVIRONMENT: EnvironmentScheme,
  PORT: z.string().transform((value) => parseInt(value)),
});

export type TConfig = z.infer<typeof Config>;

export const config = Config.parse(process.env);
