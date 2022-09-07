import 'reflect-metadata';

import app from './App';

import { db } from './db';
import { redisClient } from './redisCient';

import { logger } from './utils/helpers/Logger';
import { config } from './config';

global.logger = logger;

async function main() {
  // Detect unhandled exceptions
  process.on('unhandledRejection', (reason, promise) => {
    logger.logError(
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

  app.listen({ host: '0.0.0.0', port: config.API_PORT }, (): void => {
    logger.logSuccess(`🚀 🚀 🚀 API is running on http://localost:${config.API_PORT}`);
  });
}
if (require.main === module) {
  main();
}
