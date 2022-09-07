import { z } from 'zod';

export const updateUserBodySchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  enabled: z.boolean().optional(),
  email: z.string().optional(),
  roleIds: z.array(z.string()).optional(),
});

export type UpdateUserBodyType = z.infer<typeof updateUserBodySchema>;
