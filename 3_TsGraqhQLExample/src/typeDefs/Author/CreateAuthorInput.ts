import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateAuthorInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  country?: string;

  @Field(() => Int)
  age!: number;
}
