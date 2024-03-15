import { z } from 'zod';
import { fileSchema, validateEmail } from './common-rules';

// Custom error messages
const errorMessage = (fieldName: string) => `${fieldName} is required`;

// Step 1
export const step1Schema = z.object({
  shopname: z.string().min(1, { message: errorMessage('Shop Name') }),
  username: z.string().min(1, { message: errorMessage('Username') }),
  cover: fileSchema.optional(),
  email: z.string().min(1, { message: errorMessage('Email') }),
  mobileNo: z.string().min(1, { message: errorMessage('Mobile number') }),
  alternatemobileNo: z
    .string()
    .min(1, { message: errorMessage('Alternate mobile number') }),
  description: z.string().min(1, { message: errorMessage('Description') }),
  instagram: z.string().min(1, { message: errorMessage('Instagram') }),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
});
export type Step1Schema = z.infer<typeof step1Schema>;

// Step 2
export const step2Schema = z.object({
  pincode: z.string().min(1, { message: errorMessage('Pincode') }),
  address1: z.string().min(1, { message: errorMessage('Address1') }),
  address2: z.string().min(1, { message: errorMessage('Address2') }),
  landmark: z.string().min(1, { message: errorMessage('Landmark') }),
  city: z.string().min(1, { message: errorMessage('City') }),
  state: z.string().min(1, { message: errorMessage('State') }),
});
export type Step2Schema = z.infer<typeof step2Schema>;

// Step 3
export const sellingCategorySchema = z.object({
  category: z.string().min(1, { message: errorMessage('Category') }),
  photo: fileSchema.optional(),
});

export const step3Schema = z.object({
  sellingcategories: z.array(sellingCategorySchema).optional(),
});
export type Step3Schema = z.infer<typeof step3Schema>;

// export const step3Schema = z.object({
//   productVariants: z
//     .array(
//       z.object({
//         name: z.string().optional(),
//         value: z.string().optional(),
//       })
//     )
//     .optional(),
// });
// export type Step3Schema = z.infer<typeof step3Schema>;

// Step 4
export const ownerPersonalSchema = z.object({
  name: z.string().min(1, { message: errorMessage('Owner name') }),
  phone: z.string().min(1, { message: errorMessage('Phone') }),
  email: z.string().min(1, { message: errorMessage('Email') }),
});

export const ownerAddressSchema = z.object({
  pincode: z.string().min(1, { message: errorMessage('Pincode') }),
  address1: z.string().min(1, { message: errorMessage('Address1') }),
  address2: z.string().min(1, { message: errorMessage('Address2') }),
  landmark: z.string().min(1, { message: errorMessage('Landmark') }),
  city: z.string().min(1, { message: errorMessage('City') }),
  state: z.string().min(1, { message: errorMessage('State') }),
});

export const step4Schema = z.object({
  personal: ownerPersonalSchema,
  address: ownerAddressSchema,
});
export type Step4Schema = z.infer<typeof step4Schema>;

// Step 5
export const aadharSchema = z.object({
  name: z.string().min(1, { message: errorMessage('Name') }),
  address: z.string().min(1, { message: errorMessage('Address') }),
  careof: z.string().min(1, { message: errorMessage('Care of') }),
  aadharnumber: z.string().min(1, { message: errorMessage('Aadhar number') }),
  signed: z.boolean(),
});

export const panSchema = z.object({
  name: z.string().min(1, { message: errorMessage('Name') }),
  ptype: z.string().min(1, { message: errorMessage('Type') }),
  pannumber: z.string().min(1, { message: errorMessage('PAN number') }),
  signed: z.boolean(),
});

export const bankSchema = z.object({
  name: z.string().min(1, { message: errorMessage('Name') }),
  branch: z.string().min(1, { message: errorMessage('Branch') }),
  account: z.string().min(1, { message: errorMessage('Account number') }),
  ifsc: z.string().min(1, { message: errorMessage('IFSC') }),
  signed: z.boolean(),
});

export const step5Schema = z.object({
  aadhar: aadharSchema,
  pan: panSchema,
  bank: bankSchema,
  gst: z.string().optional(),
  taxid: z.string().optional(),
  certificate: z.array(fileSchema).optional(),
  signed: z.boolean(),
});

export type Step5Schema = z.infer<typeof step5Schema>;

// Step 6
export const deliveryPartnerPersonalSchema = z.object({
  have: z.string().min(1, { message: errorMessage('Yes or No') }),
  name: z.string().optional(),
  rate: z.string().optional(),
});

export const deliveryPartnerWarehouseSchema = z.object({
  warehouse_name: z
    .string()
    .min(1, { message: errorMessage('Warehouse name') }),
  name: z.string().min(1, { message: errorMessage('Name') }),
  address: z.string().min(1, { message: errorMessage('Address') }),
  address_2: z.string().min(1, { message: errorMessage('Address 2') }),
  city: z.string().min(1, { message: errorMessage('City') }),
  state: z.string().min(1, { message: errorMessage('State') }),
  pincode: z.string().min(1, { message: errorMessage('Pincode') }),
  phone: z.string().min(1, { message: errorMessage('Phone') }),
});

export const step6Schema = z.object({
  personal: deliveryPartnerPersonalSchema,
  partner: z.object({
    email: validateEmail,
    password: z.string().min(1, { message: errorMessage('Password') }),
    // warehouses: z.array(deliveryPartnerWarehouseSchema),
  }),
});

export type Step6Schema = z.infer<typeof step6Schema>;
