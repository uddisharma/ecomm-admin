'use client';
import { useContext, useState } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import dynamic from 'next/dynamic';
import FormGroup from '@/component/others/form-group';
import FormFooter from '@/component/others/form-footer';
import cn from '@/utils/class-names';
import { z } from 'zod';
import SelectLoader from '@/component/loader/select-loader';
import PageHeader from '@/component/others/pageHeader';
import { Button } from '@/component/ui/button';
import Link from 'next/link';
import { fileSchema } from '@/utils/validators/common-rules';
import { categoriesData } from '@/data/allcategories';
import { UserContext } from '@/store/user/context';
import axios from 'axios';
import { BaseApi, addCategory, sellerCategoriesByAdmin } from '@/constants';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import AvatarUploadS3 from '@/component/ui/file-upload/avatar-upload-s3';

const schema = z.object({
  parent: z.string().optional(),
  child: z.string().optional(),
  subchild: z.string().optional(),
  photo: fileSchema.refine((data) => data != null, {
    message: 'Photo is required',
  }),
});

type Schema = z.infer<typeof schema>;

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

const initialValues = {
  parent: '',
  child: '',
  subchild: '',
  photo: undefined,
};

export default function CreateCategory1() {
  const [reset, setReset] = useState({});

  const pageHeader = {
    title: 'Create Category',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/categories',
        name: 'Categories',
      },
      {
        name: 'Add Category',
      },
    ],
  };

  const [isLoading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const { state, setUser } = useContext(UserContext);

  const params = useParams();
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let {
    data,
    isLoading: loading,
    error,
    mutate,
  } = useSWR(
    `${BaseApi}${sellerCategoriesByAdmin}/${params?.seller}`,
    fetcher,
    {
      refreshInterval: 3600000,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      onErrorRetry({ retrycount }: any) {
        if (retrycount > 3) {
          return false;
        }
      },
    }
  );

  // const sellingItems = state?.user?.sellingCategory;
  const sellingItems = data?.data?.sellingCategory;

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
        sellingItems &&
        !sellingItems.some(
          (sellingItem: any) => sellingItem.category.id === item.id
        )
    );
  };

  const parentOptions = filterOutSellingItems(categoriesData)?.map((e: any) => {
    return {
      name: e.name,
      value: e.id,
    };
  });

  const childOptions = filterOutSellingItems(
    selectedCategory?.subcategory
  )?.map((e: any) => {
    return {
      name: e.name,
      value: e.id,
    };
  });
  const subchildoptions = filterOutSellingItems(
    selectedSubcategory?.subcategory
  )?.map((e: any) => {
    return {
      name: e.name,
      value: e.id,
    };
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (selectedItem?.id == undefined) {
      return toast.error('Please select the Category');
    }
    if (!data?.photo) {
      return toast.error('Please add a photo');
    }
    const categoryData = {
      sellerId: state?.user?.id,
      category: selectedItem?.id,
      photo: data?.photo?.url,
    };
    setLoading(true);
    axios
      .patch(`${BaseApi}${addCategory}`, categoryData)
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          toast.success('Category Added !');
          setUser(res?.data?.data);
        } else {
          toast.error('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={`/${params?.seller}/categories`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            View all Categories
          </Button>
        </Link>
      </PageHeader>

      {error && (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      )}
      {loading &&
        [1, 2, 3]?.map((e) => (
          <div className="mt-5" key={e}>
            <SelectLoader />
          </div>
        ))}
      {sellingItems && (
        <Form<Schema>
          validationSchema={schema}
          resetValues={reset}
          onSubmit={onSubmit}
          useFormProps={{
            defaultValues: initialValues,
          }}
        >
          {({
            register,
            control,
            getValues,
            setValue,
            formState: { errors },
          }) => (
            <div
              className={cn(
                'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium'
              )}
            >
              <div>
                <>
                  <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                    <FormGroup
                      title="Select Category"
                      className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                    >
                      <div className="mb-5 @3xl:col-span-2">
                        <Controller
                          name="parent"
                          control={control}
                          render={() => (
                            <Select
                              options={parentOptions}
                              label="Parent Category"
                              onChange={handleCategoryChange}
                              value={selectedCategory?.name || ''}
                            />
                          )}
                        />
                      </div>
                      {selectedCategory && (
                        <div className="mb-5 @3xl:col-span-2">
                          <Controller
                            name="child"
                            control={control}
                            render={() => (
                              <Select
                                options={childOptions}
                                label="Child Category"
                                onChange={handleSubcategoryChange}
                                value={selectedSubcategory?.name || ''}
                              />
                            )}
                          />
                        </div>
                      )}
                      {selectedSubcategory && (
                        <div className="mb-5 @3xl:col-span-2">
                          <Controller
                            name="subchild"
                            control={control}
                            render={() => (
                              <Select
                                options={subchildoptions}
                                label="Sub Child Category"
                                onChange={handleItemChange}
                                value={selectedItem?.name || ''}
                              />
                            )}
                          />
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup
                      title="Add Photo"
                      className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                    >
                      <div className="col-span-2 flex flex-col items-center gap-4 @xl:flex-row">
                        <AvatarUploadS3
                          name="photo"
                          setValue={setValue}
                          getValues={getValues}
                          error={errors?.photo?.message as string}
                        />
                      </div>
                    </FormGroup>
                  </div>
                  <FormFooter
                    isLoading={isLoading}
                    altBtnText="Cancel"
                    submitBtnText="Save"
                  />
                </>
              </div>
            </div>
          )}
        </Form>
      )}
    </>
  );
}
