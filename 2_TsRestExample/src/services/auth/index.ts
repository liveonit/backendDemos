import { config } from '@src/config';
import { User } from '@src/entities/User';
import * as argon2 from 'argon2';

import { Role } from '@src/entities/Role';
import { FindManyOptions, In } from 'typeorm';

import { signJwt, verifyJwt } from './jwt';
import {
  UserSessionType,
  UserPayloadType,
  userPayloadSchema,
  userSessionSchema,
} from '@typeDefs/User';
import _ from 'lodash';
import { redisClient } from '@src/redisCient';
import { CreateUserBodyType, RefreshTokenBodyType, UpdateUserBodyType } from '@src/typeDefs/User';
import { LoginBodyType } from '@src/typeDefs/User/LoginBody';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BadRequest, Forbidden, NotFound, Unauthorized } from '@src/utils/errors';
import { handleErrorAsync } from '@middlewares/errorCatcher';
export interface CustomContext {
  req: Request;
  res: Response;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayloadType;
    }
  }
}

class AuthService {
  public async createUser(user: CreateUserBodyType): Promise<Omit<User, 'password'>> {
    let newUser = User.create(user as User);
    newUser.password = await argon2.hash(user.password);
    if (user.roleIds) newUser.roles = await Role.find({ where: { id: In(user.roleIds) } });
    newUser = await newUser.save();
    return _.omit(newUser, ['password']);
  }

  public async updateUser(id: string, user: UpdateUserBodyType): Promise<Omit<User, 'password'>> {
    let currentUser = await User.findOneOrFail({
      where: { id },
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
    if (!result.affected) throw new NotFound();
    return !!result.affected;
  }

  public async getAll(options?: FindManyOptions<User>): Promise<User[]> {
    const result = await User.find({ relations: ['roles', 'roles.permissions'], ...options });
    return result.map((r) => _.omit(r, ['password']));
  }

  public async getOne({ id, username }: { id?: string; username?: string }): Promise<User> {
    const result = await User.findOneOrFail({
      where: { id, username },
      relations: ['roles', 'roles.permissions'],
    });
    return _.omit(result, ['password']);
  }

  public signToken = async (user: _.Omit<User, 'password'>) => {
    // Sign the access token
    const accessToken = signJwt(user, 'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${config.ACCESS_TOKEN_EXPIRES_IN}m`,
    });

    // Sign the refresh token
    const refreshToken = signJwt(user, 'REFRESH_TOKEN_PRIVATE_KEY', {
      expiresIn: `${config.REFRESH_TOKEN_EXPIRES_IN}m`,
    });

    // Create a Session
    redisClient.set(user.id, JSON.stringify(user), {
      EX: (config.REFRESH_TOKEN_EXPIRES_IN + 60) * 60,
    });
    const result = userSessionSchema.parse({ id: user.id, accessToken, refreshToken });
    // Return access token
    return result;
  };

  public async login(data: LoginBodyType): Promise<UserSessionType> {
    const { username, password } = data;
    const user = await User.findOne({
      where: { username: username },
      relations: ['roles', 'roles.permissions'],
    });
    if (user) {
      const correctPassword = await argon2.verify(user.password!, password);
      if (!correctPassword) {
        throw new Unauthorized();
      }
    } else {
      throw new Unauthorized();
    }
    const signedToken = await this.signToken(_.omit(user, ['password']));
    const result = userSessionSchema.parse(signedToken);
    return result;
  }

  public async logout(id: string): Promise<void> {
    await redisClient.del(id);
  }

  public async refreshToken(refreshTokenInput: RefreshTokenBodyType): Promise<UserSessionType> {
    try {
      // Validate the Refresh token
      const decoded = verifyJwt<UserPayloadType>(
        refreshTokenInput.refreshToken,
        'REFRESH_TOKEN_PUBLIC_KEY',
      );
      if (!decoded) {
        throw new BadRequest('Could not refresh access token');
      }

      // Check if the user has a valid session
      const session = await redisClient.get(decoded.id);
      if (!session) {
        throw new BadRequest('Could not refresh access token');
      }
      const userPayload = JSON.parse(session);

      // Sign new access token
      const accessToken = signJwt(userPayload, 'ACCESS_TOKEN_PRIVATE_KEY', {
        expiresIn: `${config.ACCESS_TOKEN_EXPIRES_IN}m`,
      });

      // Send the access token as cookie
      const result = userSessionSchema.parse({
        ...refreshTokenInput,
        accessToken,
        id: userPayload.id,
      });
      return result;
    } catch (err: any) {
      logger.error('Error refreshing access token: ' + err, 'AUTH');
      throw new BadRequest('Could not refresh access token');
    }
  }

  private getTokenFromHeader(req: Request) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

  /**
   * @param {string[]} requiredPermissionsName - A list of permissions that the user needs to have to pass through this middleware,
   * if the list is empty the only requirement is that the user has to be authenticated
   *
   * @returns {Promise<import('express').RequestHandler>} An express.RequestHandler so its could be used in the express `app` or `router` methods
   *
   * @example
   * // It should be used in an express router function, for example
   *
   * // Only auth required
   * router.get('/', authSvc.authRequiredMiddleware([]), authorController.getMany);
   *
   * // EditAuthors permission required
   * router.post('/', authSvc.authRequiredMiddleware(['editAuthors']), authorController.create);
   *
   * //  Or to require authorization throughout the App, add this before setting the app's routers
   * app.use('/', authSvc.authRequiredMiddleware([]));
   *
   */

  public authRequiredMiddleware(requiredPermissionsName: string[]): RequestHandler {
    return handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
      const token = this.getTokenFromHeader(req);
      if (token == null) throw new Forbidden();
      const userPayload: UserPayloadType | null = userPayloadSchema.parse(
        verifyJwt(token, 'ACCESS_TOKEN_PUBLIC_KEY'),
      );
      if (!userPayload) throw new Forbidden();
      let result;
      if (requiredPermissionsName.length) {
        let userPermissions: string[] = [];
        for (const role of userPayload.roles || []) {
          if (role.permissions)
            userPermissions = [...userPermissions, ...role.permissions.map((p: Role) => p.name)];
        }
        const validPermissions = requiredPermissionsName.filter((p) => userPermissions.includes(p));
        if (requiredPermissionsName.length && !validPermissions.length)
          throw new Forbidden();
        else result = userPayload;
      } else {
        result = userPayload;
      }
      req.user = result;
      return next();
    });
  }
}

export const authSvc = new AuthService();
