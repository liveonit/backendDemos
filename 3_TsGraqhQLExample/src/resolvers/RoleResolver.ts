import { Resolver, Query, Mutation, Arg, Int, UseMiddleware } from 'type-graphql';
import { CreateRoleInput, UpdateRoleInput } from '@src/typeDefs/Role';
import { Role } from '@entities/Role';
import { Permission } from '@entities/Permission';
import { In } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import { authSvc } from '@src/services/auth';

@Resolver()
export class RoleResolver {
  @Query(() => [Role])
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async roles(
    @Arg('limit', { nullable: true }) limit: number,
    @Arg('offset', { nullable: true }) offset: number,
  ): Promise<Role[]> {
    let roles = await Role.find({ relations: ['permissions'] });
    if (offset && limit) {
      roles = roles.slice(offset, offset + limit + 1);
    }
    return roles;
  }

  @Query(() => Role)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async role(@Arg('id', () => Int) id: string): Promise<Role> {
    const role = await Role.findOneOrFail({ where: { id }, relations: ['permissions'] });
    return role as Role;
  }

  @Mutation(() => Role)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async createRole(@Arg('data') data: CreateRoleInput): Promise<Role> {
    const role = Role.create(data as Role);
    if (data.permissionIds)
      role.permissions = await Permission.find({
        where: { id: In(data.permissionIds) },
      });
    return role.save();
  }

  @Mutation(() => Role)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async updateRole(@Arg('data') data: UpdateRoleInput): Promise<Role> {
    const role = await Role.findOneOrFail({ where: { id: data.id }, relations: ['permissions'] });
    if (data.permissionIds)
      role.permissions = await Permission.find({
        where: { id: In(data.permissionIds) },
      });
    return role.save();
  }

  @Mutation(() => String)
  @UseMiddleware([authSvc.gqlAuthRequiredMiddleware(['manageUsers'])])
  async deleteRole(@Arg('id') id: string): Promise<string> {
    const result = await Role.delete({ id });
    if (!result.affected) throw new ApolloError('User not found');
    return id;
  }
}
