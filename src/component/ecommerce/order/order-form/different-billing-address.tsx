import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Checkbox } from '@/component/ui/checkbox';

interface DifferentBillingAddressProps {
  className?: string;
}

export default function DifferentBillingAddress({
  className,
}: DifferentBillingAddressProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name="sameShippingAddress"
      control={control}
      render={({ field: { value, onChange } }) => (
        <Checkbox
          value={value}
          defaultChecked={value}
          onChange={onChange}
          label="Shipping Address is the same as Billing Address"
        />
      )}
    />
  );
}
