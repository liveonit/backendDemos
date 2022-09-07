import { createClient } from 'redis';
import { config } from '@src/config';
export const redisClient = createClient({
  socket: { host: config.REDIS_HOST, port: config.REDIS_PORT },
  password: config.REDIS_PASSWORD,
});

redisClient.on('error', (err) => {
  logger.logError('Connection error: ' + err, 'REDIS');
});
