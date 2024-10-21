'use client';
import { useState } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
import dynamic from 'next/dynamic';
import Spinner from '@/component/ui/spinner';
import FormGroup from '@/component/others/form-group';
import cn from '@/utils/class-names';
import { z } from 'zod';
import SelectLoader from '@/component/loader/select-loader';
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { BaseApi, errorRetry, singleCoupon } from '@/constants';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { useCookies } from 'react-cookie';
import { fetcher } from '@/constants/fetcher';
import { toast } from 'sonner';
import { extractPathAndParams } from '@/utils/urlextractor';
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
  const [reset, _setReset] = useState({});
  const params = useParams();

  const [cookies] = useCookies(['admintoken']);

  let {
    data,
    isLoading: loading,
    error,
  } = useSWR(
    `${BaseApi}${singleCoupon}/${params?.slug}`,
    (url) => fetcher(url, cookies.admintoken),
    {
      refreshInterval: 3600000,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      onErrorRetry({ retrycount }: any) {
        if (retrycount > errorRetry) {
          return false;
        }
      },
    }
  );

  const authstatus = error?.response?.data?.status == 'UNAUTHORIZED' && true;

  const initialValues = {
    code: data?.data?.code ?? '',
    discount_type:
      data?.data?.discount_type == 'direct_amount'
        ? 'Direct Amount'
        : 'Percentage',
    discount: data?.data?.discount.toString() ?? '',
  };

  const onSubmit: SubmitHandler<Schema> = () => { };
  const pageHeader = {
    title: 'View Coupon',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/${params?.seller}/dashboard`,
        name: 'Seller',
      },
      {
        name: 'View Coupon',
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

  if (authstatus) {
    localStorage.removeItem('admin');
    toast.error('Session Expired');
    const currentUrl = window.location.href;
    const path = extractPathAndParams(currentUrl);
    if (typeof window !== 'undefined') {
      location.href = `/auth/sign-in?ref=${path}`;
    }
  }

  if (error) {
    return (
      <div>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link
            href={`/${params?.seller}/coupons`}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto "
              variant='outline'
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
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link
            href={`/${params?.seller}/coupons`}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto "
              variant='outline'
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
                      className=""
                    >
                      <div className=" @3xl:col-span-2">
                        <Input
                          label="Coupon Code (must be unique)"
                          className="col-span-full"
                          placeholder="Code"
                          style={{ textTransform: 'uppercase' }}
                          {...register('code')}
                          error={errors.code?.message as string}
                        />
                      </div>
                      <div className=" @3xl:col-span-2">
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
                      <div className=" @3xl:col-span-2">
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
