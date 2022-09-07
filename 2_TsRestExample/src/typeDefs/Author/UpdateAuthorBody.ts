import { z } from 'zod';

export const updateAuthorBodySchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  age: z.number().optional(),
});

export type UpdateAuthorBodyType = z.infer<typeof updateAuthorBodySchema>;
