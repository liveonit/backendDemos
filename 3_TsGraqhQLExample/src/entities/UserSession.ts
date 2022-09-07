import { ObjectType, Field } from 'type-graphql';

import { Role } from './Role';

export interface UserSessionPayload {
  id: string;
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: Role[];
}

@ObjectType()
export class UserSession {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
