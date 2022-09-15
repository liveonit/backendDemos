import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { authorSvc } from '@src/services/AuthorService';
import { createAuthorBodySchema, updateAuthorBodySchema } from '@src/typeDefs/Author';
import { paginationQuerySchema } from '@src/typeDefs/PaginationQueryType';
import { BadRequest } from '@src/utils/errors';
import { Request, Response } from 'express';

class AuthorController {
  public create = handleErrorAsync(async (req: Request, res: Response) => {
    const body = createAuthorBodySchema.parse(req.body);
    const result = await authorSvc.create(body);
    return res.status(200).json(result);
  });

  public getMany = handleErrorAsync(async (req: Request, res: Response) => {
    const pagination = paginationQuerySchema.parse(req.params);
    const result = await authorSvc.getMany({ ...pagination });
    return res.status(200).json(result);
  });

  public update = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    const body = updateAuthorBodySchema.parse(req.body);
    const result = await authorSvc.updateAuthor(+id, body);
    return res.status(200).json(result);
  });

  public getById = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    const result = await authorSvc.getById(+id);
    return res.status(200).json(result);
  });

  public delete = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    await authorSvc.deleteAuthor(+id);
    return res.status(200).json();
  });
}

export default AuthorController;
