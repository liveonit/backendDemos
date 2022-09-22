import { z } from 'zod';

export const userPayloadSchema = z.object({
  id: z.string(),
  username: z.string(),
  enabled: z.boolean(),
  emailVerified: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(z.any()),
  sessionId: z.string(),
});
export type UserPayloadType = z.infer<typeof userPayloadSchema>;

export const userSessionSchema = z.object({
  id: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type UserSessionType = z.infer<typeof userSessionSchema>;
