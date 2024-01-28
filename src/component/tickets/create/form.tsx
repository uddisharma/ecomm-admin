'use client';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { Input } from '@/component/ui/input';
import FormGroup from '@/component/others/form-group';
import FormFooter from '@/component/others/form-footer';
import {
  ticketFormSchema,
  TicketFormTypes,
} from '@/utils/validators/create-ticket';
import { useContext, useState } from 'react';
import { UserContext } from '@/store/user/context';
import dynamic from 'next/dynamic';
import QuillLoader from '@/component/loader/quill-loader';
import axios from 'axios';
import { BaseApi, createTicket } from '@/constants';
import { toast } from 'sonner';
const QuillEditor = dynamic(() => import('@/component/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});
export default function EventForm() {
  const [reset, setReset] = useState({});
  const { state } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    type: '',
    subject: '',
    description: '',
    seller: state?.user?.id,
  };
  const onSubmit: SubmitHandler<TicketFormTypes> = (data) => {
    setLoading(true);
    axios
      .post(`${BaseApi}${createTicket}`, data)
      .then((res) => {
        console.log(res.data);
        if (res?.data?.status == 'SUCCESS') {
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
        setLoading(false);
      });
  };
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Form<TicketFormTypes>
      validationSchema={ticketFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      className="@container"
      useFormProps={{
        mode: 'onChange',
        defaultValues,
      }}
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => {
        return (
          <>
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Ticket Info"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  placeholder="Subject"
                  className="col-span-full flex-grow"
                />
                <Controller
                  // className="col-span-full"
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <QuillEditor
                      value={value}
                      onChange={onChange}
                      className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px]"
                      labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                    />
                  )}
                />
              </FormGroup>
            </div>
            <FormFooter
              // isLoading={isLoading}
              altBtnText="Cancel"
              submitBtnText="Create"
            />
          </>
        );
      }}
    </Form>
  );
}
