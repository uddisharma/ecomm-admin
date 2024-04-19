'use client';
import { useCallback } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import { Button } from '@/component/ui/button';
import { ActionIcon } from '@/component/ui/action-icon';
import TrashIcon from '@/component/icons/trash';
import { PiPlusBold } from 'react-icons/pi';
import { Checkbox } from 'rizzui';
import { commonSizes, commoncolors } from '@/constants/color-size';
import dynamic from 'next/dynamic';
import SelectLoader from '@/component/loader/select-loader';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const colors = [
  {
    name: '',
    code: '',
    available: '',
  },
];
const sizes = [
  {
    size: '',
    available: '',
  },
];

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

  const addCustomField = useCallback(() => append([...colors]), [append]);

  const addCustomField1 = useCallback(() => apd([...sizes]), [apd]);

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
          {fields.length > 1 && (
            <ActionIcon
              onClick={() => remove(index)}
              variant="flat"
              className="mt-7 shrink-0"
            >
              <TrashIcon className="h-4 w-4" />
            </ActionIcon>
          )}
        </div>
      ))}
      <Button
        onClick={addCustomField}
        variant="outline"
        className="col-span-full ml-auto w-auto"
      >
        <PiPlusBold className="me-2 h-4 w-4" strokeWidth={2} /> Add Color
      </Button>

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
          {fds.length > 1 && (
            <ActionIcon
              onClick={() => rm(index)}
              variant="flat"
              className="mt-7 shrink-0"
            >
              <TrashIcon className="h-4 w-4" />
            </ActionIcon>
          )}
        </div>
      ))}
      <Button
        onClick={addCustomField1}
        variant="outline"
        className="col-span-full ml-auto w-auto"
      >
        <PiPlusBold className="me-2 h-4 w-4" strokeWidth={2} /> Add Size
      </Button>
    </FormGroup>
  );
}
