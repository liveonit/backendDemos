import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import apiV1 from './apiV1';

import compression from 'compression';
import { NotFoundError } from './utils/errors/NotFoundError';

import { errorCatcher } from './middlewares/errorsCatcher';
class App {
  public express: express.Application;
  private apiEndpoint: string;
  constructor(apiEntpoint = 'api') {
    this.apiEndpoint = apiEntpoint;
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
    this.express.use(this.notFoundError);
    this.express.use(errorCatcher);
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(json());
    this.express.use(urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private setRoutes(): void {
    this.express.use(`/${this.apiEndpoint}/v1`, apiV1);
  }

  private notFoundError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!err) throw new NotFoundError();
    next(err);
  };
}

export default new App().express;
