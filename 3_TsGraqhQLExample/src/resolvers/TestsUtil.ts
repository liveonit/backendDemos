import { Resolver, Mutation, UseMiddleware } from 'type-graphql';

import { authSvc } from '@src/services/auth';
import { db } from '@src/db';
import { gqlLogMiddleware } from '@src/utils/middlewares/gqlLogMiddleware';

@Resolver()
export class TestsUtilResolver {
  @Mutation(() => Boolean)
  @UseMiddleware([gqlLogMiddleware, authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async clearDb(): Promise<boolean> {
    await db.clearDb();
    return true;
  }
}
