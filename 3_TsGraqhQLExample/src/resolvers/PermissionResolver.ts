import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { CreatePermissionInput, UpdatePermissionInput } from '@src/typeDefs/Permission';
import { Permission } from '@entities/Permission';
import { ApolloError } from 'apollo-server-express';
import { authSvc } from '@src/services/auth';

@Resolver()
export class PermissionResolver {
  @Query(() => [Permission])
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async permissions(
    @Arg('limit', { nullable: true }) limit: number,
    @Arg('offset', { nullable: true }) offset: number,
  ): Promise<Permission[]> {
    let permissions = await Permission.find();
    if (offset && limit) {
      permissions = permissions.slice(offset, offset + limit + 1);
    }
    return permissions.map(
      (r) => ({ id: r.id, name: r.name, description: r.description } as Permission),
    );
  }

  @Query(() => Permission)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async permission(@Arg('id', () => String) id: string): Promise<Permission> {
    const permission = await Permission.findOneByOrFail({ id });
    return permission as Permission;
  }

  @Mutation(() => Permission)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async createPermission(@Arg('data') data: CreatePermissionInput): Promise<Permission> {
    const permission = Permission.create(data as Permission);
    return permission.save();
  }

  @Mutation(() => Permission)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async updatePermission(@Arg('data') data: UpdatePermissionInput): Promise<Permission> {
    const permission = await Permission.findOneByOrFail({ id: data.id });
    return Permission.create({ ...permission, ...data }).save();
  }

  @Mutation(() => String)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async deletePermission(@Arg('id') id: string): Promise<string> {
    const result = await Permission.delete({ id });
    if (!result.affected) throw new ApolloError('User not found');
    return id;
  }
}
