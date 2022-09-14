import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { DataSource } from 'typeorm';

import path from 'path';

import { config } from '@src/config';

export class Db {
  public readonly config: MysqlConnectionOptions;
  public readonly dataSource;
  constructor(loggingEnabled?: boolean) {
    this.config = {
      type: 'mysql',
      host: config.DB_HOST,
      port: config.DB_PORT,
      username: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      synchronize: false,
      logging: loggingEnabled ? ['error', 'query', 'schema'] : ['error'],
      entities: [path.resolve(__dirname, '../entities/**/*{.js,.ts}')],
      migrations: [
        path.resolve(__dirname, 'migrations/**/*{.js,.ts}'),
        path.resolve(__dirname, 'seeds/**/*{.js,.ts}'),
      ],
    };
    this.dataSource = new DataSource(this.config);
  }

  public connectDb = async (params: {
    retry?: boolean;
    retryMsInterval?: number;
    runAfterConnect?: 'migrations' | 'syncModels' | 'dropAndSyncModels';
  }): Promise<DataSource | undefined> => {
    const { retry, retryMsInterval, runAfterConnect } = params;
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        logger.success('DB CONNECTION SUCCESSFULLY CREATED 💾 🗂 💾', 'TypeORM');
      } else {
        logger.success('DB ALREADY CONNECTED 💾 🗂 💾', 'TypeORM');
      }
      if (runAfterConnect === 'migrations') await this.runMigrations();
      else if (runAfterConnect === 'syncModels' || runAfterConnect === 'dropAndSyncModels')
        await this.syncModels(runAfterConnect === 'dropAndSyncModels');
    } catch (err) {
      logger.error('DB CONNECTION REFUSED 📛 🆘 📛 ', 'TypeORM');
      logger.error(`${err}`, 'TypeORM');
      if (retry) {
        if (this.config.logging === 'all')
          logger.info(
            `It will try to reestablish connection ${retryMsInterval || 30 * 1000} ms`,
            'TypeORM',
          );
        setTimeout(() => this.connectDb(params), params.retryMsInterval || 30 * 1000);
      }
    }
    return this.dataSource;
  };

  public disconnectDb = async (): Promise<void> => {
    try {
      await this.dataSource.destroy();
      if (this.config.logging === 'all')
        logger.success('DB CONNECTION CLOSED SUCCESSFULLY 💾 🗂 💾', 'TypeORM');
    } catch (err) {
      logger.error(`${err}`, `TypeORM`);
    }
  };

  public getConnection = () => {
    if (!this.dataSource.isInitialized) {
      logger.error('Database disconnected', 'TypeORM');
      this.connectDb({ retry: true }).then(() =>
        logger.success('Database automatically reconnected!'),
      );
    }
    return this.dataSource;
  };

  public syncModels = async (dropBefore: boolean) => {
    try {
      await this.getConnection().synchronize(dropBefore);
      if (this.config.logging === 'all')
        logger.info('Synchronization between API models and DB was done!!!', 'TypeORM');
    } catch (err) {
      logger.error('Synchronization between API models models and DB failed', 'TypeORM');
    }
  };

  public runMigrations = async () => {
    try {
      logger.info('Running migrations...', 'TypeORM');
      const hasPendingMigrations = await this.getConnection().showMigrations();
      if (hasPendingMigrations) {
        const appliedMigrations = await this.getConnection().runMigrations();
        logger.success(
          `${appliedMigrations?.length || 0} migrations were successfully applied!`,
          `TypeORM`,
        );
      } else logger.success(`There is no pending migration to apply!`, `TypeORM`);

      return true;
    } catch (err) {
      logger.error(`Error running migrations. ERROR: ${err}`, `TypeORM`);
      return false;
    }
  };

  public async clearDb() {
    await this.dataSource.dropDatabase();
    await this.runMigrations();
  }
}

export const db = new Db(config.ENVIRONMENT !== 'production');
