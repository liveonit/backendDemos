import { z } from 'zod';

export const updatePermissionBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type updatePermissionBodyType = z.infer<typeof updatePermissionBodySchema>;
