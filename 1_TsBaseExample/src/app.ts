import express, { urlencoded } from 'express';
import helmet from 'helmet';
import { logger } from '@utils/Logger';
import { errorMiddleware } from '@middlewares/error.middleware';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import { router } from './routers';

import { config } from './config';

export class App {
  private app = express();

  constructor() {
    this.setMiddlewares();
    this.setRoutes();
  }

  private setMiddlewares = (): void => {
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(loggerMiddleware);
    this.app.use(errorMiddleware);
  };
  private setRoutes = (): void => {
    this.app.use('/v1', router);
  };
  public start = (): void => {
    this.app.listen(config.PORT, () => {
      logger.logInfo(`Server is listening on ${config.ENVIRONMENT}`);
      logger.logInfo(`Environment ${config.ENVIRONMENT}`);
    });
  };
}
