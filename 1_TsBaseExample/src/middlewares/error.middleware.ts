import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/Logger';
import {} from '@src/utils/errors/types';
import { BaseError, InternalServer } from '@src/utils/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.logError({ error });
  if (error instanceof BaseError)
    res.status((error as BaseError).statusCode).send({ error: error.message });
  else {
    const err = new InternalServer(error.message);
    res.status(err.statusCode).json({ error: error.message });
  }
};
