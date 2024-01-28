import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import { categoryOption } from '@/component/ecommerce/product/create-edit/form-utils';
import dynamic from 'next/dynamic';
import SelectLoader from '@/component/loader/select-loader';
import QuillLoader from '@/component/loader/quill-loader';
import { useContext } from 'react';
import { UserContext } from '@/store/user/context';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import('@/component/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function ProductSummary({ className }: { className?: string }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { state } = useContext(UserContext);
  const categories1 = state?.user?.sellingCategory?.map((e: any) => {
    return {
      name: (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <img style={{ height: '25px', width: '25px' }} src={e.photo} alt="" />
          <p>{`${e?.category?.name} in ${e?.category?.parentCategoryId?.parentCategoryId?.name} ${e?.category?.parentCategoryId?.name} wear`}</p>
        </div>
      ),
      value: `${e?.category?.name} in ${e?.category?.parentCategoryId?.parentCategoryId?.name} ${e?.category?.parentCategoryId?.name} wear`,
      id: e?.category?.id,
    };
  });

  return (
    <FormGroup
      title="Summary"
      description="Edit your product description and necessary information from here"
      className={cn(className)}
    >
      <Input
        label="Title"
        placeholder="Product title"
        {...register('name')}
        error={errors.name?.message as string}
      />

      <Input
        label="Brand"
        placeholder="Product Brand"
        {...register('brand')}
        error={errors.brand?.message as string}
      />

      <Controller
        name="category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            options={categories1}
            value={value}
            onChange={onChange}
            label="category"
            className="col-span-full"
            error={errors?.category?.message as string}
            getOptionValue={(option) => option.value}
            getOptionDisplayValue={(option) => option.name}
          />
        )}
      />

      <Controller
        control={control}
        name="desc"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Description"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            error={errors?.desc?.message as string}
          />
        )}
      />
    </FormGroup>
  );
}
