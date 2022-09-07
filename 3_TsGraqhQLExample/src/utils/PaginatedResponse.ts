import { ClassType, Field, ObjectType, Int } from 'type-graphql';

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType(`Paginated${TItemClass.name}Response`)
  class PaginatedResponseClass {
    @Field(() => [TItemClass])
    items!: TItem[];

    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    skip!: number;

    @Field(() => Int)
    count!: number;
  }
  return PaginatedResponseClass as any;
}
