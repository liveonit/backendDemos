import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  username!: string;

  @Field(() => String, { nullable: true })
  password!: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => Boolean, { defaultValue: true })
  enabled?: boolean;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => [String], { nullable: true })
  roleIds?: string[];
}
