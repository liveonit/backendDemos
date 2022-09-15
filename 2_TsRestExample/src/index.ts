import 'reflect-metadata';

import { App } from './App';

import { db } from './db';
import { redisClient } from './redisCient';

import { logger } from '@utils/Logger';
global.logger = logger;

async function main() {
  // Detect unhandled exceptions
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      JSON.stringify({
        error: 'Unhandled promise rejection',
        promise,
        reason,
      }),
    );
  });

  // Initialize DB connection
  // Connect to db, run pending migrations and run seeds
  await db.connectDb({ retry: true, runAfterConnect: 'migrations' });

  // Connect Redis client cache
  await redisClient.connect();

  const app = new App();
  app.start();
}
if (require.main === module) {
  main();
}
