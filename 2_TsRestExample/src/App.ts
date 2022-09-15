import { db } from './db';
import { redisClient } from './redisCient';
import express, { Request, Response, NextFunction, urlencoded } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { errorCatcher } from '@middlewares/errorCatcher';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import router from './apiV1';

import { config } from './config';
import { NotFound } from '@utils/errors';

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
    this.app.use(compression());
    this.app.use(loggerMiddleware);
  };
  private setRoutes = (): void => {
    this.app.get('/health', this.healthCheck);
    this.app.use('/v1', router);
  };

  private notFoundError = (req: Request, res: Response, next: NextFunction) => {
    throw new NotFound();
  };

  private healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    const dbStatus = (await db.getConnection().isInitialized) ? 'Connected' : 'Disconnected';
    const dbMigrations =
      (await db.getConnection().showMigrations())
        ? 'There are pending migrations'
        : "There aren't pending migrations";
    const redisStatus = (await redisClient.ping()) === 'PONG' ? 'Connected' : 'Disconnected';
    return res.status(200).json({
      dbStatus,
      dbMigrations,
      redisStatus,
    });
  };

  public start = (): void => {
    this.app.listen(config.API_PORT, () => {
      logger.info(`Server is listening on ${config.ENVIRONMENT}`);
      logger.info(`Environment ${config.ENVIRONMENT}`);
    });
  };
}
