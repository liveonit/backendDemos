import { createClient } from 'redis';
import { config } from '@src/config';
export const redisClient = createClient({
  socket: { host: config.redisHost, port: config.redisPort },
  password: config.redisPassword,
});

redisClient.on('error', (err) => {
  logger.logError('Connection error: ' + err, 'REDIS');
});
