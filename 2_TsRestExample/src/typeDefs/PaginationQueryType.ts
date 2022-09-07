import { z } from 'zod';

export const paginationQuerySchema = z.object({
  skip: z
    .string()
    .or(z.undefined())
    .transform((v) => (typeof v === 'string' ? +v : undefined)),
  take: z
    .string()
    .or(z.undefined())
    .transform((v) => (typeof v === 'string' ? +v : undefined)),
});
export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
