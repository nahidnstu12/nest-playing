import mongoose from 'mongoose';
import { Status } from 'src/@core/enum/common';
import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(5, { message: 'Must be 5 or more characters long' }),
  body: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  tags: z.string().array().optional(),
  status: z.nativeEnum(Status).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid MongoDB ObjectId',
  });
