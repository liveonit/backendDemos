import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String)
  firstName?: string;

  @Field(() => String)
  lastName?: string;

  @Field(() => Boolean, { defaultValue: true })
  enabled?: boolean;

  @Field(() => String)
  email?: string;

  @Field(() => [String], { nullable: true })
  roleIds?: string[];
}
