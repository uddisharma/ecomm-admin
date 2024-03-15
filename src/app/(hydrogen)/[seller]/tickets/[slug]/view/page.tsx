'use client';
import { useContext, useState } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
import dynamic from 'next/dynamic';
import Spinner from '@/component/ui/spinner';
import FormGroup from '@/component/others/form-group';
import FormFooter from '@/component/others/form-footer';
import cn from '@/utils/class-names';
import { z } from 'zod';
import SelectLoader from '@/component/loader/select-loader';
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import axios from 'axios';
import { BaseApi, addCoupon, singleCoupon, updateCoupon } from '@/constants';
import toast from 'react-hot-toast';
import { UserContext } from '@/store/user/context';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
const schema = z.object({
  code: z.string().min(1, { message: 'Code is Required' }),
  discount_type: z.string().min(1, { message: 'Discount Type is Required' }),
  discount: z.string().min(1, { message: 'Discount is Required' }),
});

type Schema = z.infer<typeof schema>;

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

export default function NewsLetterForm() {
  const [reset, setReset] = useState({});
  const params = useParams();
  const router = useRouter();
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);

  let {
    data,
    error,
    isLoading: loading,
  } = useSWR(`${BaseApi}${singleCoupon}/${params?.slug}`, fetcher, {
    refreshInterval: 3600000,
  });

  const initialValues = {
    code: data?.data?.code ?? '',
    discount_type:
      data?.data?.discount_type == 'direct_amount'
        ? 'Direct Amount'
        : 'Percentage' ?? '',
    discount: data?.data?.discount.toString() ?? '',
  };

  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext(UserContext);
  const onSubmit: SubmitHandler<Schema> = (data) => {
    setIsLoading(true);
    axios
      .patch(`${BaseApi}${updateCoupon}/${params?.slug}`, {
        ...data,
        code: data?.code?.toUpperCase()?.split(' ').join(''),
        discount: Number(data?.discount),
        seller: state?.user?.id,
        discount_type:
          data.discount_type == 'Percentage' ? 'percentage' : 'direct_amount',
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          router.back();
          return toast('Coupon Code Updated Successfully !');
        } else {
          return toast.error('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const pageHeader = {
    title: 'View Coupon',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/coupons',
        name: 'Coupons',
      },
      {
        name: 'View',
      },
    ],
  };

  const disountType = [
    {
      name: 'Percentage',
      value: 'percentage',
    },
    {
      name: 'Direct Amount',
      value: 'direct_amount',
    },
  ];
  if (error) {
    return (
      <div>
        <br />
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link href={'/coupons'} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              View all Coupons
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
      </div>
    );
  }
  if (data) {
    return (
      <>
        <br />
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link href={'/coupons'} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              View all Coupons
            </Button>
          </Link>
        </PageHeader>

        {loading && <Spinner />}
        <Form<Schema>
          validationSchema={schema}
          resetValues={reset}
          onSubmit={onSubmit}
          useFormProps={{
            defaultValues: initialValues,
          }}
        >
          {({ register, control, formState: { errors } }) => (
            <div
              className={cn(
                'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium'
              )}
            >
              <div>
                <>
                  <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                    <FormGroup
                      title="Coupon Details"
                      className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                    >
                      <div className="mb-5 @3xl:col-span-2">
                        <Input
                          label="Coupon Code (must be unique)"
                          className="col-span-full"
                          placeholder="Code"
                          style={{ textTransform: 'uppercase' }}
                          {...register('code')}
                          error={errors.code?.message as string}
                        />
                      </div>
                      <div className="mb-5 @3xl:col-span-2">
                        <Controller
                          name="discount_type"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              options={disountType}
                              value={value}
                              onChange={onChange}
                              label="Discount Type"
                              error={errors?.discount_type?.message as string}
                              getOptionValue={(option) => option.name}
                            />
                          )}
                        />
                      </div>
                      <div className="mb-5 @3xl:col-span-2">
                        <Input
                          label="Discount"
                          className="col-span-full"
                          placeholder="Discount"
                          type="number"
                          style={{ textTransform: 'uppercase' }}
                          {...register('discount')}
                          error={errors.discount?.message as string}
                        />
                      </div>
                    </FormGroup>

                    <div
                      style={{
                        minHeight: '150px',
                        height: '150px',
                        width: '100%',
                      }}
                    ></div>
                  </div>
                </>
              </div>
            </div>
          )}
        </Form>
      </>
    );
  }
}
