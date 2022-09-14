import express, { Request, Response, NextFunction, urlencoded } from 'express';
import helmet from 'helmet';
import { errorCatcher } from '@middlewares/errorCatcher';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import { router } from './routers';

import { config } from './config';

import { logger } from '@utils/Logger';
import { NotFound } from '@utils/errors';
global.logger = logger;
export class App {
  public readonly app = express();

  constructor() {
    this.setMiddlewares();
    this.setRoutes();
    this.app.use(this.notFoundError);
    this.app.use(errorCatcher);
  }

  private setMiddlewares = (): void => {
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(loggerMiddleware);
    this.app.use(errorCatcher);
  };
  private setRoutes = (): void => {
    this.app.use('/v1', router);
  };

  private notFoundError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!err) throw new NotFound();
    next(err);
  };
  public start = (): void => {
    this.app.listen(config.PORT, () => {
      logger.info(`Server is listening on ${config.ENVIRONMENT}`);
      logger.info(`Environment ${config.ENVIRONMENT}`);
    });
  };
}
