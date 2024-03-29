'use client';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
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
  errorRetry,
  findSingleSeller,
  singleTransaction,
  updateTransaction,
} from '@/constants';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { IoIosSearch } from 'react-icons/io';
import { GoArrowRight } from 'react-icons/go';
import { useCookies } from 'react-cookie';
import { fetcher } from '@/constants/fetcher';
import { extractPathAndParams } from '@/utils/urlextractor';
const schema = z.object({
  transactionId: z.string().min(1, { message: 'Transaction ID is Required' }),
  amount: z.string().min(1, { message: 'Amount is Required' }),
  from: z.string().min(1, { message: 'From date is Required' }),
  to: z.string().min(1, { message: 'To date is Required' }),
});

type Schema = z.infer<typeof schema>;

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

  const pageHeader = {
    title: 'Edit Payout',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/payouts/al`,
        name: 'Payouts',
      },
      {
        name: 'Edit',
      },
    ],
  };

  const [cookies] = useCookies(['admintoken']);

  let {
    data,
    isLoading: loading,
    error,
  } = useSWR(
    `${BaseApi}${singleTransaction}/${params?.slug}`,
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

  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading1, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);

  useEffect(() => {
    if (data != null) {
      setInputValue(
        `${data?.data?.seller?.shopname} ${data?.data?.seller?.username}`
      );
    }
  }, [data]);

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (inputValue == '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const findSeller = () => {
    if (inputValue == '') {
      return toast.warning('Please enter a keyword');
    }
    setLoading(true);
    axios
      .get(`${BaseApi}${findSingleSeller}?term=${inputValue}`, {
        headers: {
          Authorization: `Bearer ${cookies?.admintoken}`,
        },
      })
      .then((res) => {
        if (res?.data?.data) {
          setSearchedData(res?.data?.data);
          let sellers = res?.data?.data?.map((e: any) => {
            return `${e?.shopname} ${e?.username}`;
          });
          setFilteredSuggestions(sellers);
          setShowSuggestions(true);
        } else {
          setFilteredSuggestions([]);
          return toast.warning('Seller Not found');
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.status == 'UNAUTHORIZED') {
          localStorage.removeItem('admin');
          const currentUrl = window.location.href;
          const path = extractPathAndParams(currentUrl);
          if (typeof window !== 'undefined') {
            location.href = `/auth/sign-in?ref=${path}`;
          }
          return toast.error('Session Expired');
        }
        return toast.error('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const seller =
    searchedData &&
    searchedData?.filter((e: any) => {
      return `${e?.shopname} ${e?.username}` == inputValue;
    });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    const seller2 =
      seller && seller?.length <= 0 ? params?.slug : seller && seller[0]?.id;
    if (seller2 == undefined || null) {
      return toast.error('Unable to get details of seller');
    }

    setIsLoading(true);
    axios
      .patch(
        `${BaseApi}${updateTransaction}/${params?.slug}`,
        {
          ...data,
          seller: seller2,
          from: convertDateFormat(data?.from),
          to: convertDateFormat(data?.to),
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      )
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
        if (err?.response?.data?.status == 'UNAUTHORIZED') {
          localStorage.removeItem('admin');
          const currentUrl = window.location.href;
          const path = extractPathAndParams(currentUrl);
          if (typeof window !== 'undefined') {
            location.href = `/auth/sign-in?ref=${path}`;
          }
          return toast.error('Session Expired');
        }
        return toast.error('Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (authstatus) {
    localStorage.removeItem('admin');
    toast.error('Session Expired');
    const currentUrl = window.location.href;
    const path = extractPathAndParams(currentUrl);
    if (typeof window !== 'undefined') {
      location.href = `/auth/sign-in?ref=${path}`;
    }
  }

  if (loading) {
    return (
      <div>
        <br />
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link
            href={`/payouts/all`}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              View all Payouts
            </Button>
          </Link>
        </PageHeader>
        <div style={{ paddingBottom: '100px' }}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <br />
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link
            href={'/payouts/all'}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              View all Payouts
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
            href={`/payouts/all`}
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
                      description="Edit Transaction Details"
                      className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                    >
                      <div className="relative col-span-full">
                        <Input
                          prefix={<IoIosSearch className="h-5 w-5" />}
                          suffix={
                            loading1 ? (
                              <Spinner className="h-5 w-5 cursor-not-allowed" />
                            ) : (
                              <GoArrowRight
                                onClick={findSeller}
                                className="h-5 w-5 cursor-pointer"
                              />
                            )
                          }
                          label="Seller"
                          className="col-span-full"
                          placeholder="Seller"
                          value={inputValue}
                          onChange={handleChange}
                        />
                        {showSuggestions && (
                          <ul className="absolute z-10 mt-2 w-full rounded-md border border-gray-300  bg-white shadow-md dark:bg-gray-100">
                            {filteredSuggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleSelectSuggestion(suggestion)
                                }
                                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Input
                        label="Transaction ID"
                        placeholder="Transacion ID"
                        style={{ textTransform: 'uppercase' }}
                        {...register('transactionId')}
                        error={errors.transactionId?.message as string}
                      />

                      <Input
                        label="Amount"
                        placeholder="Amount"
                        type="number"
                        {...register('amount')}
                        error={errors.amount?.message as string}
                      />

                      <Input
                        label="From Date"
                        placeholder="Date"
                        type="date"
                        {...register('from')}
                        error={errors.from?.message as string}
                      />

                      <Input
                        label="To Date"
                        placeholder="Date"
                        type="date"
                        {...register('to')}
                        error={errors.to?.message as string}
                      />
                    </FormGroup>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
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
