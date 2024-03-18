'use client';
import { useCallback, useContext, useState } from 'react';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  Controller,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import dynamic from 'next/dynamic';
import cn from '@/utils/class-names';
import { Button } from '@/component/ui/button';
import TrashIcon from '@/component/icons/trash';
import SelectLoader from '@/component/loader/select-loader';
import { PiPlusBold } from 'react-icons/pi';
import FormSummary from './form-summary';

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { z } from 'zod';
import { fileSchema } from '@/utils/validators/common-rules';
import AvatarUpload from '@/component/ui/file-upload/avatar-upload';
import { categoriesData } from '@/data/allcategories';
import { toast } from 'sonner';
import { BaseApi, UpdateSeller } from '@/constants/index';
import axios from 'axios';
import { OnboardingContext } from '@/store/onboarding/context';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

const step3Schema = z.object({
  productVariants: z
    .array(
      z.object({
        category: z.string().min(1, { message: 'Category is required' }),
        photo: fileSchema.optional(),
      })
    )
    .optional(),
});
type Step3Schema = z.infer<typeof step3Schema>;

const formParts = {
  variantOptions: 'variantOptions',
};

const productVariants = [
  {
    category: '',
    photo: undefined,
  },
];

export default function StepFour({ step, setStep }: any) {
  const [isLoading, setLoading] = useState(false);
  const { setOnboarding, state } = useContext(OnboardingContext);

  const seller = state?.onboarding;
  const s_categories = seller?.sellingCategory;

  const s_categories1 = s_categories?.map((e: any) => {
    return {
      category: `${e?.category?.parentCategoryId?.parentCategoryId?.name} ${e?.category?.parentCategoryId?.name} ${e?.category?.name} ${e?.category?.id}`,
      photo: {
        name: `${e?.category?.parentCategoryId?.parentCategoryId?.name} ${e?.category?.parentCategoryId?.name} ${e?.category?.name}`,
        size: 1024,
        url: e?.photo,
      },
    };
  });
  const methods = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      productVariants:
        s_categories && s_categories1?.length > 0
          ? s_categories1
          : productVariants,
    },
  });

  function checkFields(data: any) {
    for (const item of data) {
      if (!item.hasOwnProperty('category') || !item.hasOwnProperty('photo')) {
        return false;
      }
      if (!item.photo?.hasOwnProperty('url')) {
        return false;
      }
    }
    return true;
  }

  const onSubmit: SubmitHandler<Step3Schema> = (data) => {
    const hasRequiredFields = checkFields(data?.productVariants);

    if (!hasRequiredFields) {
      return toast.warning(
        'Every Category must have a Category name and a Photo'
      );
    }
    const sellingCategory = data?.productVariants?.map((e) => {
      return { category: e?.category?.split(' ').pop(), photo: e?.photo?.url };
    });

    setLoading(true);
    axios
      .patch(`${BaseApi}${UpdateSeller}/${seller?.id}`, {
        sellingCategory,
      })
      .then((res) => {
        if (res?.data?.status == 'SUCCESS') {
          setOnboarding(res?.data?.data);
          setStep(5);
          return toast.success('Details saved Successfully');
        } else {
          toast.warning(res?.data?.message ?? 'Something went wrong!');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const flattenCategories = (categories: any, parentLabel: any = '') => {
    return categories.flatMap((category: any) => {
      const name = parentLabel
        ? `${parentLabel} ${category.name}`
        : category.name;

      const value = parentLabel
        ? `${parentLabel} ${category.name} ${category.id}`
        : `${category.name} ${category.id}`;

      if (category.subcategory && category.subcategory.length > 0) {
        return flattenCategories(category.subcategory, name);
      } else {
        return [{ name, value }];
      }
    });
  };

  const categories = flattenCategories(categoriesData);
  return (
    <div className="@container">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn('[&_label.block>span]:font-medium')}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            <Element name={formParts.variantOptions}>
              <ProductVariants />
            </Element>
          </div>
        </form>
      </FormProvider>
    </div>
  );

  function ProductVariants() {
    const {
      control,
      register,
      getValues,
      setValue,
      formState: { errors },
    } = useFormContext();

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'productVariants',
    });

    const addVariant = useCallback(
      () => append([...productVariants]),
      [append]
    );
    return (
      <>
        <div
          className={cn(
            'mx-auto grid w-full max-w-screen-2xl grid-cols-12 place-content-center gap-6 px-5 py-10 @3xl:min-h-[calc(100vh-10rem)] @5xl:gap-8 @6xl:gap-16 xl:px-7'
          )}
        >
          <div className="col-span-full flex flex-col justify-center @5xl:col-span-5">
            <FormSummary
              className="@7xl:me-10"
              step={4}
              title=" What Do You Specialize In ?"
              description="Tell us about the categories your store specializes in and share captivating photos. This step helps in creating a visually appealing and engaging storefront, attracting customers interested in your unique range of products."
            />
          </div>

          <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
            <div className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0">
              <>
                <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                  <div className="col-span-full">
                    {fields.map((item: any, index: any) => (
                      <div
                        key={item.id}
                        className="col-span-full mt-4 grid gap-4  rounded-lg border border-gray-300 p-5 @2xl:grid-cols-2 @2xl:pt-9 @3xl:pt-4 @4xl:col-span-8 @4xl:gap-5 xl:gap-7"
                      >
                        <Controller
                          name={`productVariants.${index}.category`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              options={categories}
                              value={value}
                              onChange={onChange}
                              label="Choose Category"
                              className="col-span-full"
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        <div className="grid-container1 col-span-full rounded-lg border border-gray-300 p-4">
                          <div className="m-auto mt-14">
                            <h4 className="text-base font-medium">
                              Category Photo
                            </h4>
                            <p className="mt-2">
                              This will be displayed on your profile.
                            </p>
                          </div>
                          <div className="m-auto ">
                            <AvatarUpload
                              name={`productVariants.${index}.photo`}
                              setValue={setValue}
                              getValues={getValues}
                            />
                          </div>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            onClick={() => remove(index)}
                            variant="outline"
                            className="col-span-full ml-auto w-auto"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Remove Category
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={addVariant}
                    variant="outline"
                    className="col-span-full ml-auto w-auto"
                  >
                    <PiPlusBold className="me-2 h-4 w-4" /> Add Category
                  </Button>

                  <Button
                    onClick={() => {
                      setStep(3);
                    }}
                    variant="outline"
                    className="mt-5 w-full"
                    type="button"
                    color="primary"
                  >
                    <MdKeyboardArrowLeft className="mr-1 h-4 w-4 text-gray-500" />
                    Prev
                  </Button>
                  <Button
                    isLoading={isLoading}
                    className=" mt-5"
                    type="submit"
                    color="primary"
                  >
                    Next
                    <MdKeyboardArrowRight className="ml-1 h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </>
            </div>
          </div>
        </div>
      </>
    );
  }
}
