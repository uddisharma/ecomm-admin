import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from '@/utils/validators/common-rules';

const colorSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, { message: messages.productNameIsRequired }),
  price: z.coerce.number().min(1, { message: messages.priceIsRequired }),
  mrp: z.coerce.number().min(1, { message: 'MRP is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  desc: z.string().min(1, { message: 'Description is required' }),
  images: fileSchema.refine((data) => data != null, {
    message: 'Photo is required',
  }),
  stock: z.string().min(1, { message: 'Stock is required' }),
  tags: z.array(z.string()).optional(),
  colors: z.array(colorSchema).optional(),
  sizes: z.array(z.string()).optional(),
  instaId: z.string().min(1, { message: 'Instagram Post Link is required' }),
  height: z.string().min(1, { message: 'Height is required' }),
  weight: z.string().min(1, { message: 'Weight is required' }),
  length: z.string().min(1, { message: 'Length is required' }),
  breadth: z.string().min(1, { message: 'Breadth is required' }),
});

export type CreateProductInput = z.infer<typeof productFormSchema>;
