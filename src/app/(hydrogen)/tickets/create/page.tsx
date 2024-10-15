'use client';
import { useContext, useEffect, useState } from 'react';
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
import { Button } from 'rizzui';
import axios from 'axios';
import { BaseApi, createTicket, findSingleSeller } from '@/constants';
import { toast } from 'sonner';
import { IoIosSearch } from 'react-icons/io';
import { GoArrowRight } from 'react-icons/go';
import { useCookies } from 'react-cookie';
import { extractPathAndParams } from '@/utils/urlextractor';
const schema = z.object({
  type: z.string().min(1, { message: 'Type is Required' }),
  subject: z.string().min(1, { message: 'Subject is Required' }),
  description: z.string().min(1, { message: 'Description is Required' }),
});

type Schema = z.infer<typeof schema>;

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

const QuillEditor = dynamic(() => import('@/component/ui/quill-editor'), {
  ssr: false,
  loading: () => (
    <div className="grid h-10 place-content-center">
      <Spinner />
    </div>
  ),
});

const types = [
  {
    name: 'Technical',
    value: 'Technical',
  },
  {
    name: 'General',
    value: 'General',
  },
];

export default function NewsLetterForm() {

  const initialValues = {
    type: '',
    subject: '',
    description: '',
  };
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);

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
        `${BaseApi}${createTicket}`,
        {
          ...data,
          seller: seller && seller[0]?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.status == 'SUCCESS') {
          setReset(initialValues);
          return toast.success('Ticket Created Successfully');
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
  const pageHeader = {
    title: 'Create Ticket',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/tickets',
        name: 'Tickets',
      },
      {
        name: 'Create',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={`/tickets`} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            View all Tickets
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
                    title="Ticket Type"
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
                    <div className=" @3xl:col-span-2">
                      <Controller
                        name="type"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            options={types}
                            value={value}
                            onChange={onChange}
                            label="Type"
                            error={errors?.type?.message as string}
                            getOptionValue={(option) => option.name}
                          />
                        )}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup
                    title="Subject and Description"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <Input
                      label="Subject"
                      className="col-span-full"
                      placeholder="Subject"
                      {...register('subject')}
                      error={errors.subject?.message as string}
                    />
                    <div className="@3xl:col-span-2">
                      <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                          <QuillEditor
                            value={value}
                            onChange={onChange}
                            className="[&>.ql-container_.ql-editor]:min-h-[100px]"
                            error={errors.description?.message as string}
                            label="Description"
                          />
                        )}
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
