import { ApolloError } from 'apollo-server-express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '@src/config';

export const signJwt = (
  payload: Object,
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
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
  key: 'accessTokenPublicKey' | 'refreshTokenPublicKey',
): T | null => {
  try {
    const publicKey = Buffer.from(config[key], 'base64').toString('ascii');
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    logger.error(error);
    throw new ApolloError('Invalid credentials');
  }
};
