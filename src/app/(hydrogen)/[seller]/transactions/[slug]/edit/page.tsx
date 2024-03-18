'use client';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
import dynamic from 'next/dynamic';
import FormGroup from '@/component/others/form-group';
import FormFooter from '@/component/others/form-footer';
import cn from '@/utils/class-names';
import { z } from 'zod';
import SelectLoader from '@/component/loader/select-loader';
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import axios from 'axios';
import { BaseApi, singleTransaction, updateTransaction } from '@/constants';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
const schema = z.object({
  transactionId: z.string().min(1, { message: 'Transaction ID is Required' }),
  amount: z.string().min(1, { message: 'Amount is Required' }),
  from: z.string().min(1, { message: 'From date is Required' }),
  to: z.string().min(1, { message: 'To date is Required' }),
});

type Schema = z.infer<typeof schema>;

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

export default function NewsLetterForm() {
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  function convertDateFormat(dateString: any) {
    const date = new Date(dateString);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const timezoneOffsetMinutes = date.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(
      Math.trunc(timezoneOffsetMinutes / 60)
    );
    const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes) % 60;
    const timezoneSign = timezoneOffsetMinutes < 0 ? '+' : '-';

    const formattedDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${String(
      timezoneOffsetHours
    ).padStart(2, '0')}:${String(timezoneOffsetMinutesRemainder).padStart(
      2,
      '0'
    )}`;

    return formattedDateString;
  }

  const onSubmit: SubmitHandler<Schema> = (data) => {
    setIsLoading(true);
    axios
      .patch(`${BaseApi}${updateTransaction}/${params?.slug}`, {
        ...data,
        seller: params?.seller,
        from: convertDateFormat(data?.from),
        to: convertDateFormat(data?.to),
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          setReset(initialValues);
          router.back();
          return toast.success('Transaction is updated Successfully !');
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
    title: 'Edit Transaction',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/${params?.seller}/transactions`,
        name: 'Transactions',
      },
      {
        name: 'Edit',
      },
    ],
  };
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);

  let {
    data,
    error,
    isLoading: loading,
  } = useSWR(`${BaseApi}${singleTransaction}/${params?.slug}`, fetcher, {
    refreshInterval: 3600000,
    revalidateOnMount: true,
  });

  function convertToSimpleDateFormat(dateString: any) {
    const [datePart] = dateString.split('T');

    return datePart;
  }

  const initialValues = {
    transactionId: data?.data?.transactionId,
    amount: String(data?.data?.amount),
    from: data && convertToSimpleDateFormat(data?.data?.from),
    to: data && convertToSimpleDateFormat(data?.data?.to),
  };
  if (error) {
    return (
      <div>
        <br />
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link
            href={`/${params?.seller}/transactions`}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              View all Transactions
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
          <Link
            href={`/${params?.seller}/transactions`}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              View all Transactions
            </Button>
          </Link>
        </PageHeader>
        {loading &&
          [1, 2, 3, 4]?.map((e) => (
            <div className="mt-5" key={e}>
              <SelectLoader />
            </div>
          ))}
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
                      title="Transaction Details"
                      className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                    >
                      <div className="mb-5 @3xl:col-span-2">
                        <Input
                          label="Transaction ID"
                          className="col-span-full"
                          placeholder="Transacion ID"
                          style={{ textTransform: 'uppercase' }}
                          {...register('transactionId')}
                          error={errors.transactionId?.message as string}
                        />
                      </div>
                      <div className="mb-5 @3xl:col-span-2">
                        <Input
                          label="Amount"
                          className="col-span-full"
                          placeholder="Amount"
                          type="number"
                          {...register('amount')}
                          error={errors.amount?.message as string}
                        />
                      </div>
                      <div className="mb-5 @3xl:col-span-2">
                        <Input
                          label="From Date"
                          className="col-span-full"
                          placeholder="Date"
                          type="date"
                          {...register('from')}
                          error={errors.from?.message as string}
                        />
                      </div>
                      <div className="mb-5 @3xl:col-span-2">
                        <Input
                          label="To Date"
                          className="col-span-full"
                          placeholder="Date"
                          type="date"
                          {...register('to')}
                          error={errors.to?.message as string}
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
      </>
    );
  }
}
