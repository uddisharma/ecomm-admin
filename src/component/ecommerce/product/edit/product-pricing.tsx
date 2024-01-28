import { useFormContext } from 'react-hook-form';
import { Input } from '@/component/ui/input';

export default function ProductPricing() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Input
        label="Price"
        placeholder="Product price"
        {...register('price')}
        error={errors.price?.message as string}
        prefix={'₹'}
        type="number"
      />
      <Input
        label="MRP"
        placeholder="Product MRP"
        {...register('mrp')}
        error={errors.mrp?.message as string}
        prefix={'₹'}
        type="number"
      />
    </>
  );
}
