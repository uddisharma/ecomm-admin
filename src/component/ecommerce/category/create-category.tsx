'use client';
import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import SelectLoader from '@/component/loader/select-loader';
import { Button } from '@/component/ui/button';
import { Text, Title } from '@/component/ui/text';
import cn from '@/utils/class-names';
import { useModal } from '@/component/modal-views/use-modal';
import { categoriesData } from '@/data/allcategories';
import { UserContext } from '@/store/user/context';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

function HorizontalFormBlockWrapper({
  title,
  description,
  children,
  className,
  isModalView = true,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
  isModalView?: boolean;
}>) {
  return (
    <div
      className={cn(
        className,
        isModalView ? '@5xl:grid @5xl:grid-cols-6' : ' '
      )}
    >
      {isModalView && (
        <div className="col-span-2 mb-6 pe-4 @5xl:mb-0">
          <Title as="h6" className="font-semibold">
            {title}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{description}</Text>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5',
          isModalView ? 'col-span-4' : ' '
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function CreateCategory({
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
}) {
  const [isLoading, setLoading] = useState(false);
  const { closeModal } = useModal();
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const { state } = useContext(UserContext);

  const sellingItems = state?.user?.sellingCategory;

  const handleCategoryChange = (event: any) => {
    const category = categoriesData.find((cat) => cat.id === event.value);
    setSelectedCategory(category || null);
    setSelectedSubcategory(null);
    setSelectedItem(null);
  };

  const handleSubcategoryChange = (event: any) => {
    const subcategory = selectedCategory?.subcategory.find(
      (subcat: any) => subcat.id === event.value
    );
    setSelectedSubcategory(subcategory || null);
    setSelectedItem(null);
  };

  const handleItemChange = (event: any) => {
    const item = selectedSubcategory?.subcategory.find(
      (subcat: any) => subcat.id === event.value
    );
    setSelectedItem(item || null);
  };

  const filterOutSellingItems = (items: any | undefined): any => {
    if (!items) return [];
    return items.filter(
      (item: any) =>
        !sellingItems.some(
          (sellingItem: any) => sellingItem.category.id === item.id
        )
    );
  };

  return (
    <>
      <div className="flex-grow pb-10">
        <div
          className={cn(
            'grid grid-cols-1 ',
            isModalView
              ? 'grid grid-cols-1 gap-8 divide-y divide-dashed  divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11'
              : 'gap-5'
          )}
        >
          <HorizontalFormBlockWrapper
            title={'Add new category:'}
            description={'Edit your category information from here'}
            isModalView={isModalView}
          >
            <Select
              options={filterOutSellingItems(categoriesData)?.map((e: any) => {
                return {
                  name: e.name,
                  value: e.id,
                };
              })}
              label="Parent Category"
              onChange={handleCategoryChange}
              value={selectedCategory?.name || ''}
              className="col-span-full"
            />

            {selectedCategory && (
              <>
                <Select
                  options={filterOutSellingItems(
                    selectedCategory.subcategory
                  )?.map((e: any) => {
                    return {
                      name: e.name,
                      value: e.id,
                    };
                  })}
                  label="Subcategory Category"
                  onChange={handleSubcategoryChange}
                  className="col-span-full"
                  value={selectedSubcategory?.name || ''}
                />
              </>
            )}

            {selectedSubcategory && (
              <>
                <Select
                  options={filterOutSellingItems(
                    selectedSubcategory.subcategory
                  )?.map((e: any) => {
                    return {
                      name: e.name,
                      value: e.id,
                    };
                  })}
                  label="Main Category"
                  onChange={handleItemChange}
                  value={selectedItem?.name || ''}
                  className="col-span-full"
                />
              </>
            )}

            {selectedItem && (
              <div>
                <p>
                  Selected Category: {selectedCategory?.name} (ID:{' '}
                  {selectedCategory?.id})
                </p>
                <p>
                  Selected Subcategory: {selectedSubcategory?.name} (ID:{' '}
                  {selectedSubcategory?.id})
                </p>
                <p>
                  Selected Item: {selectedItem?.name} (ID: {selectedItem?.id})
                </p>
              </div>
            )}
          </HorizontalFormBlockWrapper>
        </div>
      </div>

      <div
        className={cn(
          'sticky bottom-0  flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
          isModalView ? '-mx-10 -mb-7 px-10 py-5' : 'py-1'
        )}
      >
        <Button
          onClick={() => {
            closeModal();
          }}
          variant="outline"
          className="w-full @xl:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full @xl:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
        >
          Create Category
        </Button>
      </div>
    </>
  );
}
