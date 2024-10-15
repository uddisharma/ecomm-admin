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
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import { Button } from 'rizzui';
import axios from 'axios';
import { BaseApi, addTransaction, findSingleSeller } from '@/constants';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go';
import { IoIosSearch } from 'react-icons/io';
import { extractPathAndParams } from '@/utils/urlextractor';
import { useCookies } from 'react-cookie';
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
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);
  const params = useParams();

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

  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const [cookies] = useCookies(['admintoken']);

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
    if (seller && seller?.length <= 0) {
      return toast.error('Unable to get details of seller');
    }
    setIsLoading(true);
    axios
      .post(
        `${BaseApi}${addTransaction}`,
        {
          ...data,
          seller: seller && seller[0]?.id,
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

  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={`/payouts/all`} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            View all Payouts
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
                    description="Enter Transaction Details"
                    className=""
                  >
                    <div className="relative col-span-full">
                      <Input
                        prefix={<IoIosSearch className="h-5 w-5" />}
                        suffix={
                          loading ? (
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
                              onClick={() => handleSelectSuggestion(suggestion)}
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
                      // className="col-span-full"
                      placeholder="Transacion ID"
                      style={{ textTransform: 'uppercase' }}
                      {...register('transactionId')}
                      error={errors.transactionId?.message as string}
                    />

                    <Input
                      label="Amount"
                      // className="col-span-full"
                      placeholder="Amount"
                      type="number"
                      {...register('amount')}
                      error={errors.amount?.message as string}
                    />

                    <Input
                      label="From Date"
                      // className="flex-grow"
                      placeholder="Date"
                      type="date"
                      {...register('from')}
                      error={errors.from?.message as string}
                    />

                    <Input
                      label="To Date"
                      // className="flex-grow"
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
