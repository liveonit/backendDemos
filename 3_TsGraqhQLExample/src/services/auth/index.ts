import { config } from '@src/config';
import { User } from '@entities/User';
import * as argon2 from 'argon2';
import { ApolloError } from 'apollo-server-express';
import { Request, Response } from 'express';
import { MiddlewareFn } from 'type-graphql';
import { Role } from '@entities/Role';
import { FindOneOptions, In } from 'typeorm';
import {
  CreateUserInput,
  LoginInput,
  RefreshTokenInput,
  UpdateUserInput,
} from '@src/typeDefs/User';
import { signJwt, verifyJwt } from './jwt';
import { UserSession, UserSessionPayload } from '@entities/UserSession';
import _ from 'lodash';
import { redisClient } from '@src/redisCient';
export interface CustomContext {
  req: Request;
  res: Response;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserSession;
    }
  }
}

class AuthSvc {
  public async createUser(user: CreateUserInput): Promise<Omit<User, 'password'>> {
    let newUser = User.create(user as User);
    newUser.password = await argon2.hash(user.password);
    if (user.roleIds) newUser.roles = await Role.find({ where: { id: In(user.roleIds) } });
    newUser = await newUser.save();
    return _.omit(newUser, ['password']);
  }

  public async updateUser(user: UpdateUserInput): Promise<Omit<User, 'password'>> {
    let currentUser = await User.findOneOrFail({
      where: { id: user.id },
      relations: ['roles'],
    });
    if (user.password) currentUser.password = await argon2.hash(user.password);
    if (user.roleIds) currentUser.roles = await Role.find({ where: { name: In(user.roleIds) } });
    currentUser = await currentUser.save();
    return _.omit(currentUser, ['password']);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await User.delete({ id });
    await redisClient.del(id);
    if (!result.affected) throw new ApolloError('User not found');
    return !!result.affected;
  }

  public async getAll(options?: FindOneOptions<User>): Promise<User[]> {
    const result = await User.find({ relations: ['roles', 'roles.permissions'], ...options });
    return result;
  }

  public async getOne({ id, username }: { id?: string; username?: string }): Promise<User> {
    const result = await User.findOneOrFail({
      where: { id, username },
      relations: ['roles', 'roles.permissions'],
    });
    return result;
  }

  public signToken = async (user: _.Omit<User, 'password'>) => {
    // Sign the access token
    const accessToken = signJwt(user, 'accessTokenPrivateKey', {
      expiresIn: `${config.accessTokenExpiresIn}m`,
    });

    // Sign the refresh token
    const refreshToken = signJwt(user, 'refreshTokenPrivateKey', {
      expiresIn: `${config.refreshTokenExpiresIn}m`,
    });

    // Create a Session
    redisClient.set(user.id, JSON.stringify(user), {
      EX: (config.refreshTokenExpiresIn + 60) * 60,
    });

    // Return access token
    return { id: user.id, accessToken, refreshToken } as UserSession;
  };

  public async login(data: LoginInput): Promise<UserSession> {
    const { username, password } = data;
    const user = await User.findOne({
      where: { username: username },
      relations: ['roles', 'roles.permissions'],
    });
    if (user) {
      const correctPassword = await argon2.verify(user.password!, password);
      if (!correctPassword) {
        throw new ApolloError('Invalid Credentials');
      }
    } else {
      throw new ApolloError('Invalid user');
    }
    return this.signToken(_.omit(user, ['password']));
  }

  public async logout(id: string): Promise<void> {
    await redisClient.del(id);
  }

  public async refreshToken(refreshTokenInput: RefreshTokenInput): Promise<UserSession> {
    try {
      // Validate the Refresh token
      const decoded = verifyJwt<UserSessionPayload>(
        refreshTokenInput.refreshToken,
        'refreshTokenPublicKey',
      );
      if (!decoded) {
        throw new ApolloError('Could not refresh access token');
      }

      // Check if the user has a valid session
      const session = await redisClient.get(decoded.id);
      if (!session) {
        throw new ApolloError('Could not refresh access token');
      }
      const userPayload = JSON.parse(session);

      // Sign new access token
      const accessToken = signJwt(userPayload, 'accessTokenPrivateKey', {
        expiresIn: `${config.accessTokenExpiresIn}m`,
      });

      // Send the access token as cookie
      return { ...refreshTokenInput, accessToken, id: userPayload.id } as UserSession;
    } catch (err: any) {
      logger.error('Error refreshing access token: ' + err, 'AUTH');
      throw new ApolloError('Could not refresh access token');
    }
  }

  private getTokenFromHeader(req: Request) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

  public gqlAuthRequiredMiddleware(requiredPermissionsName: string[]): MiddlewareFn<CustomContext> {
    return async ({ context }, next) => {
      const token = this.getTokenFromHeader(context.req);
      if (token == null) throw new ApolloError('Invalid Credentials');
      const userSession: UserSessionPayload | null = verifyJwt(token, 'accessTokenPublicKey');
      if (!userSession) throw new ApolloError('Invalid credentials');
      let result;
      if (requiredPermissionsName.length) {
        let userPermissions: string[] = [];
        for (const role of userSession.roles || []) {
          if (role.permissions)
            userPermissions = [...userPermissions, ...role.permissions.map((p) => p.name)];
        }
        const validPermissions = requiredPermissionsName.filter((p) => userPermissions.includes(p));
        if (requiredPermissionsName.length && !validPermissions.length)
          throw new ApolloError('Invalid permissions');
        else result = userSession;
      } else {
        result = userSession;
      }
      context.req.user = result;
      return next();
    };
  }
}

export const authSvc = new AuthSvc();
