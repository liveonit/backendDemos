import { z } from 'zod';

export const createUserBodySchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  enabled: z.boolean().default(true),
  email: z.string(),
  roleIds: z.array(z.string()).optional(),
});

export type CreateUserBodyType = z.infer<typeof createUserBodySchema>;
