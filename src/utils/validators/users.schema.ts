import { z } from 'zod';

export const userSchema = z.object({
  password: z.string().optional(),
  mobileNo: z.string().min(1, { message: 'Mobile number is Required' }),
  email: z.string().min(1, { message: 'Email is Required' }),
  name: z.string().min(1, { message: 'Name is Required' }),

  shippingAddress: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, { message: 'Shipping address name is required' }),
        phone: z
          .string()
          .min(1, { message: 'Shipping address phone is required' }),
        phone1: z
          .string()
          .min(1, { message: 'Shipping address alternate phone is required' }),
        email: z
          .string()
          .min(1, { message: 'Shipping address email is required' }),
        pincode: z
          .string()
          .min(1, { message: 'Shipping address pincode is required' }),
        address: z.string().min(1, { message: 'Shipping address is required' }),
        landmark: z
          .string()
          .min(1, { message: 'Shipping address landmark is required' }),
        city: z
          .string()
          .min(1, { message: 'Shipping address city is required' }),
        district: z
          .string()
          .min(1, { message: 'Shipping address district is required' }),
        state: z
          .string()
          .min(1, { message: 'Shipping address state is required' }),
      })
    )
    .min(1, { message: 'At least one shipping address is required' }),
});

export type UserInput = z.infer<typeof userSchema>;
