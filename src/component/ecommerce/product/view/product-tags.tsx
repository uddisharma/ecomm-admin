'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/component/ui/input';
import { Button } from '@/component/ui/button';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import { useFormContext, useWatch } from 'react-hook-form';
import { PiTagBold, PiXBold } from 'react-icons/pi';

export default function ProductTags({ className }: { className?: string }) {
  const { control } = useFormContext();
  const tags1 = useWatch({
    control,
    name: 'tags',
  });
  const [tags, setTags] = useState<string[]>(tags1 ? tags1 : []);
  return (
    <FormGroup
      title="Product Tags"
      description="Add your product's tag or category here"
      className={cn(className)}
    >
      <ItemCrud name="Tag" items={tags} setItems={setTags} />
    </FormGroup>
  );
}

interface ItemCrudProps {
  name: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

function ItemCrud({ name, items, setItems }: ItemCrudProps): JSX.Element {
  const { register, setValue } = useFormContext();

  const [itemText, setItemText] = useState<string>('');

  function handleItemAdd(): void {
    if (itemText.trim() !== '') {
      const newItem: string = itemText;

      setItems((prevItems) => [...prevItems, newItem]);
      setItemText('');
    }
  }

  useEffect(() => {
    setValue('tags', items);
  }, [items, setValue]);

  function handleItemRemove(text: string): void {
    const updatedItems = items.filter((item) => item !== text);
    setItems(updatedItems);
  }

  return (
    <div>
      <div className="flex items-center">
        <Input
          value={itemText}
          placeholder={`Enter a ${name}`}
          onChange={(e) => setItemText(e.target.value)}
          prefix={<PiTagBold className="h-4 w-4" />}
          className="w-full"
        />
        <input type="hidden" {...register('tags', { value: items })} />
        <Button
          onClick={handleItemAdd}
          type="button"
          className="ms-4 shrink-0 text-sm @lg:ms-5 dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
        >
          Add {name}
        </Button>
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((text, index) => (
            <div
              key={index}
              className="flex items-center rounded-full border border-gray-300 py-1 pe-2.5 ps-3 text-sm font-medium text-gray-700"
            >
              {text}
              <button
                onClick={() => handleItemRemove(text)}
                type="button"
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
