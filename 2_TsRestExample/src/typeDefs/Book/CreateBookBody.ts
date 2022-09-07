import { z } from 'zod';

export const createBookBodySchema = z.object({
  title: z.string(),
  authorId: z.number(),
  isPublished: z.boolean().default(true),
});

export type CreateBookBodyType = z.infer<typeof createBookBodySchema>;
