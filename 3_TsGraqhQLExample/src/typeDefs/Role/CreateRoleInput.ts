import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateRoleInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  permissionIds?: string[];
}
