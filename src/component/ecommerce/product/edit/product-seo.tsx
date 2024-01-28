import { useFormContext } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';

export default function ProductSeo({ className }: { className?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Instagram Post and Stock"
      description="Add your instagram and stock info here"
      className={cn(className)}
    >
      <Input
        label="Instagram Link"
        placeholder="link"
        {...register('instaId')}
        error={errors.instaId?.message as string}
      />
      <Input
        label="Stock"
        type="number"
        placeholder="300"
        {...register('stock')}
        error={errors.stock?.message as string}
      />
    </FormGroup>
  );
}
