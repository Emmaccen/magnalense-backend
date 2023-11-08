import { z } from 'zod';

export const GetUserDto = z.object({
  email: z.string().email(),
});
