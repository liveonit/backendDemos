import { z } from 'zod';

export const createRoleBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export type CreateRoleBodyType = z.infer<typeof createRoleBodySchema>;
