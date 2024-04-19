'use client';

import { useCallback, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { Input } from '@/component/ui/input';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import { TbResize } from 'react-icons/tb';
import { Button } from '@/component/ui/button';
import { ActionIcon } from '@/component/ui/action-icon';
import TrashIcon from '@/component/icons/trash';
import { PiPlusBold, PiXBold } from 'react-icons/pi';
import dynamic from 'next/dynamic';
import SelectLoader from '@/component/loader/select-loader';
import { commoncolors } from '@/constants/color-size';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const colors = [
  {
    name: '',
    code: '',
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

  const sizes1 = useWatch({
    control,
    name: 'sizes',
  });

  const addCustomField = useCallback(() => append([...colors]), [append]);
  const [sizes, setSizes] = useState<string[]>(sizes1 ? sizes1 : []);
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

      <ItemCrud name="Size" items={sizes} setItems={setSizes} />
    </FormGroup>
  );
}

interface ItemCrudProps {
  name: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

function ItemCrud({ name, items, setItems }: ItemCrudProps): JSX.Element {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [itemText, setItemText] = useState<string>('');

  function handleItemAdd(): void {
    if (itemText.trim() !== '') {
      const newItem: string = itemText;

      setItems([...items, newItem]);
      setValue('sizes', [...items, newItem]);
      setItemText('');
    }
  }

  function handleItemRemove(text: string): void {
    const updatedItems = items.filter((item) => item !== text);
    setItems(updatedItems);
  }

  return (
    <div>
      <div className="flex items-center">
        <Select
          options={commoncolors}
          value={itemText}
          prefix={<TbResize className="h-4 w-4" />}
          placeholder={`Enter a ${name}`}
          onChange={(e: any) => setItemText(e)}
          label="Select Size"
          className="w-full"
          error={errors?.colors?.message as string}
          getOptionValue={(option) => option.value}
          getOptionDisplayValue={(option) => option.name}
        />

        <input type="hidden" {...register('sizes', { value: items })} />
        <Button
          onClick={handleItemAdd}
          className="ms-4 mt-6 shrink-0 text-sm @lg:ms-5 dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
        >
          Add {name}
        </Button>
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((text: any, index: any) => (
            <div
              key={index}
              className="flex items-center rounded-full border border-gray-300 py-1 pe-2.5 ps-3 text-sm font-medium text-gray-700"
            >
              {text}
              <button
                onClick={() => handleItemRemove(text)}
                className="ps-2 text-gray-500 hover:text-gray-900"
              >
                <PiXBold className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
