import { useFormContext } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';

interface ProductIdentifiersProps {
  className?: string;
}

export default function ProductIdentifiers({
  className,
}: ProductIdentifiersProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Product Dimensions"
      description="Edit your product dimensions here"
      className={cn(className)}
    >
      <Input
        label="Length"
        placeholder="10cm"
        {...register('length')}
        error={errors.length?.message as string}
      />
      <Input
        label="Breadth"
        placeholder="10cm"
        {...register('breadth')}
        error={errors.breadth?.message as string}
      />
      <Input
        label="Height"
        placeholder="10cm"
        {...register('height')}
        error={errors.height?.message as string}
      />
      <Input
        label="Weight"
        placeholder="300gm"
        {...register('weight')}
        error={errors.weight?.message as string}
      />
    </FormGroup>
  );
}
