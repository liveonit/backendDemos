import { z } from 'zod';

export const createAuthorBodySchema = z.object({
  name: z.string(),
  country: z.string().optional(),
  age: z.number().optional(),
});

export type CreateAuthorBodyType = z.infer<typeof createAuthorBodySchema>;
