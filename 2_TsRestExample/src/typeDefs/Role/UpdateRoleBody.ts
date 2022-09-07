import { z } from 'zod';

export const updateRoleBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export type UpdateRoleBodyType = z.infer<typeof updateRoleBodySchema>;
