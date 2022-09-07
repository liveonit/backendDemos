import { NonEmptyArray } from 'type-graphql';
import { UserResolver } from '@src/resolvers/UserResolver';
import { RoleResolver } from './RoleResolver';
import { AuthorResolver } from '@src/resolvers/AuthorResolver';
import { BookResolver } from './BookResolver';
import { PermissionResolver } from './PermissionResolver';
export const resolvers = [
  UserResolver,
  RoleResolver,
  AuthorResolver,
  BookResolver,
  PermissionResolver,
] as NonEmptyArray<Function>;
