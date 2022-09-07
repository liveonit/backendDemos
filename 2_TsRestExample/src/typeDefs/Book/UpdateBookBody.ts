import { z } from 'zod';

export const updateBookBodySchema = z.object({
  title: z.string().optional(),
  authorId: z.number().optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateBookBodyType = z.infer<typeof updateBookBodySchema>;
