import { Status } from 'src/@core/enum/common';
import { z } from 'zod';

export const createCategorySchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Must be greater than 5 characters long' }),
  body: z.string(),
  status: z.nativeEnum(Status).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
