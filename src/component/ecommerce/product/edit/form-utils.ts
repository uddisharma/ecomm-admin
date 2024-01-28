import { CreateProductInput } from '@/utils/validators/create-product.schema';

export const customFields = [
  {
    label: '',
    value: '',
  },
];
export const locationShipping = [
  {
    name: '',
    shippingCharge: '',
  },
];
export const productVariants = [
  {
    label: '',
    value: '',
  },
];

export function defaultValues(product?: any) {
  return {
    name: product?.name ?? '',
    price: product?.price ?? undefined,
    mrp: product?.mrp ?? undefined,
    brand: product?.brand ?? '',
    category: product?.category ?? '',
    desc: product?.desc ?? '',
    images: product?.images ?? undefined,
    stock: product?.stock ?? '',
    tags: product?.tags ?? [],
    colors: product?.colors || [
      {
        name: '',
        code: '',
        available: false,
      },
    ],
    sizes: product?.sizes || [
      {
        name: '',
        code: '',
        available: false,
      },
    ],
    instaId: product?.instaId ?? '',
    height: product?.height ?? '',
    weight: product?.weight ?? '',
    length: product?.length ?? '',
    breadth: product?.breadth ?? '',
  };
}
