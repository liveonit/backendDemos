import { buildSchema } from 'type-graphql';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { json, urlencoded } from 'body-parser';
import { db } from './db';
import { resolvers } from './resolvers';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { SubscribeMessage } from 'graphql-ws/lib/common';
import { Context } from 'graphql-ws/lib/server';
import { config } from '@src/config';
import { CustomContext } from './services/auth';

import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';

// Define Globals
import { logger } from '@utils/helpers/Logger';
import { ExecutionArgs } from 'graphql';
import { redisClient } from './redisCient';
// import { getModuleAliases } from '@utils/getModuleAliases';
global.logger = logger;

require('reflect-metadata');

export const pubsub: PubSubEngine = new PubSub();

async function main() {
  // modules config
  // getModuleAliases();

  // Connect to db, run pending migrations and run seeds
  await db.connectDb({ retry: true, runAfterConnect: 'migrations' });

  // Connect Redis client cache
  await redisClient.connect();

  // Build the graphQL `schema` from resolvers and its class decorators
  let schema;
  try {
    schema = await buildSchema({
      resolvers,
      emitSchemaFile: path.resolve(__dirname, '../schema.gql'),
      pubSub: pubsub,
    });
  } catch (err) {
    logger.error(err);
  }

  // Create an express app
  const app: Application = express();
  // Create an http server
  const server = createServer(app);

  // Creating the WebSocket subscription server
  const wsServer = new WebSocketServer({
    server: server,
    path: '/graphql',
  });
  const getDynamicContext = async (ctx: Context, msg: SubscribeMessage, args: ExecutionArgs) => {
    return { gs: { ctx, msg, args } };
  };
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx, msg, args) => {
        return getDynamicContext(ctx, msg, args);
      },
    },
    wsServer,
  );

  // Create and start apollo server
  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: ({ req, res }) => {
      const context: CustomContext = {
        req,
        res,
      };
      return context;
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            embed: true,
            graphRef: 'user@example.com',
          })
        : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await apolloServer.start();

  // endpoint to check if http and express server are running fine
  app.get('/healthz', (req: Request, res: Response) => {
    res.send('Everything is fine!!!');
  });

  // Add apollo server to express app, the apollo server is now running in `/graphql`
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // cors and others middlewares
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));

  server.listen({ host: '0.0.0.0', port: config.apiPort }, (): void => {
    logger.info(`Enviornment: ===>>> ${config.nodeEnv} <<<===`, 'Node');
    logger.info(`Express server is now running on port ${config.apiPort}`, 'Express');
    logger.info(`is now running on /graphql`, 'GraphQL');
  });
}
if (require.main === module) {
  main();
}
