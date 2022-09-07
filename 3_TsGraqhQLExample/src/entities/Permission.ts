import { ObjectType, Field } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './Role';

// NOT IN DB - ONLY REPRESENTATION
@ObjectType()
@Entity()
export class Permission extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];
}
