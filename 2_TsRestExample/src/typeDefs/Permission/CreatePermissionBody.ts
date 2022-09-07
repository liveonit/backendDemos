import { z } from 'zod';

export const createPermissionBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type CreatePermissionBodyType = z.infer<typeof createPermissionBodySchema>;
