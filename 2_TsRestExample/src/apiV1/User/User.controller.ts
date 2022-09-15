import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import {
  createUserBodySchema,
  loginBodySchema,
  refreshTokenBodySchema,
  updateUserBodySchema,
} from '@src/typeDefs/User';
import { Request, Response } from 'express';

import _ from 'lodash';
import { BadRequest, Unauthorized } from '@src/utils/errors';
import { authSvc } from '@src/services/auth';
import { paginationQuerySchema } from '@src/typeDefs/PaginationQueryType';

class AuthorController {
  /**
   * Devuelve una lista de usuarios
   */
  public getMany = handleErrorAsync(async (req: Request, res: Response) => {
    const { skip, take } = paginationQuerySchema.parse(req.params);
    const users = await authSvc.getAll({ skip, take });
    return users;
  });

  public getById = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!req.params.id) throw new BadRequest('Id is required');
    const user = await authSvc.getOne({ id });
    return res.status(200).json(user);
  });
  /**
   * Crea un nuevo usuario
   */
  public create = handleErrorAsync(async (req: Request, res: Response) => {
    const user = createUserBodySchema.parse(req.body);
    const result = await authSvc.createUser(user);
    return res.status(200).json(result);
  });

  /*
   * Actualiza los datos de un usuario. Este endpoint también se encarga de la gestión
   * de su contraseña.
   */
  public update = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!req.params.id) throw new BadRequest('Id is required');
    const user = updateUserBodySchema.parse(req.body);
    const updatedUser = await authSvc.updateUser(id, user);
    return res.status(200).json(updatedUser);
  });

  /*
   * Elimina un usuario
   */
  public delete = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    await authSvc.delete(id);
    return res.status(200).send();
  });

  /*
   * Elimina el usuario logueado
   */
  public deleteMe = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) throw new Unauthorized('Invalid credentials');
    const userId = req.user.id;
    await authSvc.delete(userId);
    return res.status(200).send();
  });

  /*
   * Devuelve el perfil del usuario logueado
   */
  public getProfile = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) throw new Unauthorized('Invalid credentials');
    const { id } = req.user;
    const user = await authSvc.getOne({ id });
    return res.status(200).json(user);
  });

  /*
   * Autenticar usuario
   */
  public logIn = handleErrorAsync(async (req: Request, res: Response) => {
    const loginData = loginBodySchema.parse(req.body);
    const result = await authSvc.login(loginData);
    return res.status(200).json(result);
  });

  /*
   * Finalizar la sesion del usuario
   */
  public logout = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.user?.id) throw new Unauthorized('Invalid credentials');
    const { id } = req.user;
    await authSvc.logout(id);
    return res.status(200).send();
  });

  /*
   * Refrescar el access token
   */
  public refreshToken = handleErrorAsync(async (req: Request, res: Response) => {
    const body = refreshTokenBodySchema.parse(req.body);
    const result = authSvc.refreshToken(body);
    return res.status(200).json(result);
  });
}

export const authorController = new AuthorController();
