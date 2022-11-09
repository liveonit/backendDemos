import { NonEmptyArray } from 'type-graphql';
import { UserResolver } from '@src/resolvers/UserResolver';
import { RoleResolver } from './RoleResolver';
import { AuthorResolver } from '@src/resolvers/AuthorResolver';
import { BookResolver } from './BookResolver';
import { PermissionResolver } from './PermissionResolver';
import { config } from '@src/config';
import { TestsUtilResolver } from './TestsUtil';
let resolvers: NonEmptyArray<Function> = [
  UserResolver,
  RoleResolver,
  AuthorResolver,
  BookResolver,
  PermissionResolver,
]

if (config.ENVIRONMENT !== 'production')
  resolvers = [...resolvers, TestsUtilResolver]

export {resolvers}
