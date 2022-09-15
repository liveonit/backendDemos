import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '@src/config';
import { Unauthorized } from '@src/utils/errors';

export const signJwt = (
  payload: Object,
  key: 'ACCESS_TOKEN_PRIVATE_KEY' | 'REFRESH_TOKEN_PRIVATE_KEY',
  options: SignOptions = {},
) => {
  const privateKey = Buffer.from(config[key], 'base64').toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  key: 'ACCESS_TOKEN_PUBLIC_KEY' | 'REFRESH_TOKEN_PUBLIC_KEY',
): T | null => {
  try {
    const publicKey = Buffer.from(config[key], 'base64').toString('ascii');
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    throw new Unauthorized('Invalid credentials');
  }
};
