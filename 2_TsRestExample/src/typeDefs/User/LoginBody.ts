import { z } from 'zod';

export const loginBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginBodyType = z.infer<typeof loginBodySchema>;
