import { z } from 'zod';

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenBodyType = z.infer<typeof refreshTokenBodySchema>;
