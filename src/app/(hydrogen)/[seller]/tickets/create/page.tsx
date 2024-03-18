'use client';
import { useState } from 'react';
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
import { BaseApi, createTicket } from '@/constants';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
const schema = z.object({
  seller: z.string().optional(),
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
  const params = useParams();
  const initialValues = {
    seller: String(params?.seller),
    type: '',
    subject: '',
    description: '',
  };
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<Schema> = (data) => {
    setIsLoading(true);
    axios
      .post(`${BaseApi}${createTicket}`, data)
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
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={`/${params?.seller}/tickets`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
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
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <div className="mb-5 @3xl:col-span-2">
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
