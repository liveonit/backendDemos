import { ApolloError } from 'apollo-server-express';
import { config } from '@src/config';
import { MiddlewareFn } from 'type-graphql';

export const gqlLogMiddleware: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  const log: any = {
    operation: info.fieldName.toString(),
    operationType: info.operation.operation,
    variableValues: info.variableValues,
    unixStartTime: start,
  };
  try {
    await next();
    log['executionTime'] = Date.now() - start;
    logger.info(log, 'GraphQLLogger');
  } catch (err) {
    const error = err as Error;
    log['executionTime'] = Date.now() - start;
    log['Error'] = error.name;
    log['ErrorMessage'] = error.message;
    log['ErrorStack'] = error.stack?.split('\n');
    logger.error(log, 'GraphQLLogger');
    throw new ApolloError(error.message, error.name, {
      stacktrace: config.ENVIRONMENT !== 'production' && error.stack?.split('\n'),
    });
  }
};
