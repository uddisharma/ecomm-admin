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
import { Button, Checkbox } from 'rizzui';
import axios from 'axios';
import { BaseApi, addReferral, findSingleSeller, findUsers } from '@/constants';
import { toast } from 'sonner';
import { GoArrowRight } from 'react-icons/go';
import { IoIosSearch } from 'react-icons/io';
const schema = z.object({
  amount: z.string().min(1, { message: 'Amount is Required' }),
  onboarded: z.boolean(),
  status: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export default function NewsLetterForm() {
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);
  const [term, setTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions1, setFilteredSuggestions1] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);

  const pageHeader = {
    title: 'Create Referral',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/referrals/all`,
        name: 'Referral',
      },
      {
        name: 'Create',
      },
    ],
  };

  const initialValues = {
    amount: '',
    onboarded: false,
    status: false,
  };

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
      .get(`${BaseApi}${findSingleSeller}?term=${inputValue}`)
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
        return toast.error('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const findUser = () => {
    setIsLoading1(true);
    axios
      .get(`${BaseApi}${findUsers}?term=${term}`)
      .then((res) => {
        if (res?.data?.data) {
          setFilteredSuggestions1(res?.data?.data);
          setShowSuggestions1(true);
        } else {
          setFilteredSuggestions1([]);
          toast.warning('User Not found');
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong');
      })
      .finally(() => {
        setIsLoading1(false);
      });
  };
  const handleSelectSuggestion1 = (suggestion: any) => {
    setTerm(suggestion);
    setFilteredSuggestions1([]);
    setShowSuggestions1(false);
  };
  useEffect(() => {
    if (!term) {
      setSearchedData([]);
    }
  }, [term]);

  const seller =
    searchedData &&
    searchedData?.filter((e: any) => {
      return `${e?.shopname} ${e?.username}` == inputValue;
    });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (seller && seller?.length <= 0) {
      return toast.error('Unable to get details of seller');
    }
    if (term == '') {
      return toast.error('Please select user');
    }
    setIsLoading(true);
    axios
      .post(`${BaseApi}${addReferral}`, {
        referringUser: term?.split('-')[2],
        referredSeller: seller && seller[0]?.id,
        amount: Number(data?.amount),
        onboarded: data?.onboarded,
        status: data?.status,
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          setReset(initialValues);
          return toast.success('Referral is added Successfully !');
        } else if (res?.data?.data?.status == 'EXIST') {
          return toast.error('Referral is already exist');
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

  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={`/referrals/all`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            View all Referrals
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
                    title="Referral Details"
                    description="Enter Referral Details"
                    className="pt-7 @2xl:pt-9 @3xl:pt-11"
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
                    <div className="relative col-span-full">
                      <Input
                        prefix={<IoIosSearch className="h-5 w-5" />}
                        suffix={
                          isLoading1 ? (
                            <Spinner className="h-5 w-5 cursor-not-allowed" />
                          ) : (
                            <GoArrowRight
                              onClick={findUser}
                              className="h-5 w-5 cursor-pointer"
                            />
                          )
                        }
                        label="User"
                        className="col-span-full"
                        placeholder="User"
                        value={term}
                        onChange={(e) => {
                          setTerm(e.target.value);
                        }}
                      />
                      {showSuggestions1 && (
                        <ul className="absolute z-10 mt-2 w-full rounded-md border border-gray-300  bg-white shadow-md dark:bg-gray-100">
                          {filteredSuggestions1.map(
                            (suggestion: any, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleSelectSuggestion1(
                                    `${suggestion?.name}-${suggestion?.email}-${suggestion?.id}`
                                  )
                                }
                                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                              >
                                {`${suggestion?.name}-${suggestion?.email}-${suggestion?.id}`}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>

                    <Input
                      label="Amount"
                      className="col-span-full"
                      placeholder="Amount"
                      type="number"
                      {...register('amount')}
                      error={errors.amount?.message as string}
                    />
                    <Checkbox
                      label="Is Onboarded"
                      {...register('onboarded')}
                      error={errors.onboarded?.message as string}
                    />
                    <Checkbox
                      label="Is Paid"
                      {...register('status')}
                      error={errors.status?.message as string}
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
