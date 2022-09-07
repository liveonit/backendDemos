import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  projectName: process.env.PROJECT_NAME as string,
  nodeEnv: process.env.NODE_ENV as string,
  isProduction: (process.env.NODE_ENV || '').includes('prod'),
  dbHost: process.env.DB_HOST as string,
  dbVendor: process.env.DB_VENDOR as string,
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbName: process.env.DB_NAME || 'default_username',
  dbUser: process.env.DB_USER || 'default_db_name',
  dbPassword: process.env.DB_PASSWORD || 'default_pass',
  apiPort: parseInt(process.env.API_PORT || '4000', 10),
  accessTokenExpiresIn: +process.env.ACCESS_TOKEN_EXPIRES_IN!,
  refreshTokenExpiresIn: +process.env.REFRESH_TOKEN_EXPIRES_IN!,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY as string,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY as string,
  redisHost: process.env.REDIS_HOST as string,
  redisPort: +process.env.REDIS_PORT!,
  redisPassword: process.env.REDIS_PASSWORD as string,
  isRemoteEnv: process.env.IS_REMOTE_ENV === 'true',
};

export const envConfig = Object.entries(process.env).reduce((prev, [k, v]) => {
  const result = { ...prev };
  if (v) result[k] = v;
  return result;
}, {} as { [k: string]: string });
