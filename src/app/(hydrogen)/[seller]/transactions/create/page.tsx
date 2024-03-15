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
import {
  BaseApi,
  addCoupon,
  addTransaction,
  singleTransaction,
  updateTransaction,
} from '@/constants';
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
    // Convert the dateString to a Date object
    const date = new Date(dateString);

    // Set time components to 00:00:00
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Get the individual date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Get the time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Get the timezone offset
    const timezoneOffsetMinutes = date.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(
      Math.trunc(timezoneOffsetMinutes / 60)
    );
    const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes) % 60;
    const timezoneSign = timezoneOffsetMinutes < 0 ? '+' : '-';

    // Construct the formatted date string
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
      .post(`${BaseApi}${addTransaction}`, {
        ...data,
        seller: params?.seller,
        from: convertDateFormat(data?.from),
        to: convertDateFormat(data?.to),
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          setReset(initialValues);
          router.back();
          return toast.success('Transaction is Created Successfully !');
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
    title: 'Create Transaction',
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
        name: 'Create',
      },
    ],
  };

  const initialValues = {
    transactionId: '',
    amount: '',
    from: '',
    to: '',
  };

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
