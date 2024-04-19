'use client';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import { Checkbox } from 'rizzui';
import { commonSizes, commoncolors } from '@/constants/color-size';
import dynamic from 'next/dynamic';
import SelectLoader from '@/component/loader/select-loader';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

export default function ShippingInfo({ className }: { className?: string }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'colors',
  });

  const {
    fields: fds,
    append: apd,
    remove: rm,
  } = useFieldArray({
    control,
    name: 'sizes',
  });

  return (
    <FormGroup
      title="Colors & Size"
      description="Add your colors and sizes info here"
      className={cn(className)}
    >
      {fields.map((item, index) => (
        <div key={item.id} className="col-span-full flex gap-4 xl:gap-7">
          <Controller
            name={`colors.${index}.name`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                options={commoncolors}
                value={value}
                onChange={onChange}
                label="Select Color"
                className="flex-grow"
                error={errors?.colors?.message as string}
                getOptionValue={(option) => option.value}
                getOptionDisplayValue={(option) => option.name}
              />
            )}
          />
          <input
            type="color"
            placeholder="#FFF"
            className="h-15 flex-grow "
            style={{ height: '40px', borderRadius: '7px', marginTop: '25px' }}
            {...register(`colors.${index}.code`)}
          />
          <Checkbox
            label="Available"
            className="mt-8"
            {...register(`colors.${index}.available`)}
          />
        </div>
      ))}

      {fds.map((item, index) => (
        <div key={item.id} className="col-span-full flex gap-4 xl:gap-7">
          <Controller
            name={`sizes.${index}.size`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                options={commonSizes}
                value={value}
                onChange={onChange}
                label="Select Size"
                className="flex-grow"
                error={errors?.sizes?.message as string}
                getOptionValue={(option) => option.value}
                getOptionDisplayValue={(option) => option.name}
              />
            )}
          />

          <Checkbox
            label="Available"
            className="mt-8"
            {...register(`sizes.${index}.available`)}
          />
        </div>
      ))}
    </FormGroup>
  );
}
