/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { BaseError } from "@utils/errors";
import { config } from '@src/config';

interface Error {
  status: number;
  name: string;
  message: string;
}

export const errorCatcher = (
  err: Record<string, unknown>,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response<unknown, Record<string, unknown>> => {
  logger.logError(err);

  if (err instanceof BaseError)
    return config.ENVIRONMENT === 'development'
      ? res.status(err.status).json({
          type: err.name,
          message: err.message,
          code: err.code,
          success: false,
          place: err.errorPlace,
        })
      : res.status(err.status).send();
  if (
    err.name === 'PayloadTooLargeError' ||
    (err instanceof SyntaxError && (err as unknown as Error).status === 400 && 'body' in err)
  )
    return config.ENVIRONMENT === 'development'
      ? res.status(400).send({
          type: 400,
          message: `${(err as unknown as Error).name} ${(err as unknown as Error).message}`,
          code: 400,
          success: false,
        })
      : res.status(400).send();
  return res.status(500).send();
};

export const handleErrorAsync =
  (func: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      logger.debug({a: "el error sale de aca", error})
      next(error);
    }
  };
