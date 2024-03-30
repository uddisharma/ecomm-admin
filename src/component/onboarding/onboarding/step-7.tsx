'use client';
import { Button, Input, Text } from 'rizzui';
import cn from '@/utils/class-names';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import FormSummary from './form-summary';
import { Step6Schema, step6Schema } from '@/utils/validators/onboarding.schema';
import { useContext, useState } from 'react';
import { Form } from '@/component/ui/form';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FaTruck } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import axios from 'axios';
import { BaseApi, UpdateSeller } from '@/constants/index';
import { toast } from 'sonner';
import Hint1 from '../policies/hint';
import { useModal } from '@/component/modal-views/use-modal';
import SelectLoader from '@/component/loader/select-loader';
import dynamic from 'next/dynamic';
import { OnboardingContext } from '@/store/onboarding/context';
import { useCookies } from 'react-cookie';
import { extractPathAndParams } from '@/utils/urlextractor';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
export default function StepSeven({ step, setStep }: any) {
  const { setOnboarding, state } = useContext(OnboardingContext);
  const [cookies] = useCookies(['admintoken']);
  const personal = state?.onboarding?.deliverypartner?.personal;
  const partner = state?.onboarding?.deliverypartner?.partner;
  const warehouses = partner.warehouses;
  const initialValues: Step6Schema = {
    personal: {
      have: personal && personal?.have ? 'Yes' : 'No',
      name: personal?.name ?? '',
      rate: personal?.rate ?? '0',
    },
    partner: {
      email: partner?.email ?? '',
      password: partner?.password ?? '',
    },
  };
  const [reset, setReset] = useState({});
  const { control, register, handleSubmit, getValues, setValue } = useForm({
    defaultValues: initialValues,
  });

  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Step6Schema> = (data) => {
    setLoading(true);
    axios
      .patch(
        `${BaseApi}${UpdateSeller}/${state?.onboarding?.id}`,
        {
          deliverypartner: {
            ...data,
            partner: {
              email: data?.partner?.email,
              password: data?.partner?.password,
              warehouses: warehouses?.length > 0 ? warehouses : [],
            },
            personal: {
              have: data?.personal?.have == 'Yes' ? true : false,
              name: data?.personal?.name,
              rate: Number(data?.personal?.rate),
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.status == 'SUCCESS') {
          setOnboarding(res?.data?.data);
          setStep(8);
          return toast.success('Details saved Successfully');
        } else {
          toast.warning(res?.data?.message ?? 'Something went wrong!');
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
        toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const { openModal } = useModal();
  return (
    <>
      <div
        className={cn(
          'mx-auto grid w-full max-w-screen-2xl grid-cols-12 place-content-center gap-6 px-5 py-10 @3xl:min-h-[calc(100vh-10rem)] @5xl:gap-8 @6xl:gap-16 xl:px-7'
        )}
      >
        <div className="col-span-full flex flex-col justify-center @5xl:col-span-5">
          <FormSummary
            className="@7xl:me-10"
            step={7}
            title="Streamline Your Deliveries"
            description=" If you use delivery partners, let us know about them. This step ensures that your products reach customers efficiently, enhancing the overall shopping experience. Share information about delivery partners and their warehouses if applicable."
          />
        </div>

        <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
          <div className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0">
            <Form<Step6Schema>
              validationSchema={step6Schema}
              resetValues={reset}
              onSubmit={onSubmit}
              useFormProps={{
                mode: 'onChange',
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
                <>
                  <Text className="mb-5  font-semibold text-gray-900">
                    Your Personal Delivery Partner
                  </Text>
                  <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                    <Controller
                      name="personal.have"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label="Do you have personal delivery partner"
                          options={[
                            {
                              name: 'Yes',
                              value: 'Yes',
                            },
                            {
                              name: 'No',
                              value: 'No',
                            },
                          ]}
                          value={value}
                          onChange={onChange}
                          className={'col-span-full'}
                          placeholder="Personal Delivery partner"
                          error={errors.personal?.have?.message}
                          getOptionValue={(option: any) => option.value}
                          getOptionDisplayValue={(option: any) => option.name}
                        />
                      )}
                    />

                    <Input
                      prefix={<FaTruck className="h-4 w-4" />}
                      label="Name (if you have)"
                      placeholder="Name of Delivery Partner"
                      {...register('personal.name')}
                      error={errors.personal?.name?.message}
                    />
                    <Input
                      label="Rate (per order)"
                      placeholder="Rate"
                      type="number"
                      {...register('personal.rate')}
                      error={errors.personal?.rate?.message}
                    />
                  </div>
                  <div className="mb-2 mt-10 flex flex-row gap-5">
                    <Text className="font-semibold text-gray-900">
                      Our Delivery Partner
                    </Text>
                    <button
                      onClick={() => {
                        openModal({
                          view: <Hint1 />,
                          customSize: '900px',
                        });
                      }}
                      className="cursor-pointer font-semibold text-green-600"
                    >
                      View Hint
                    </button>
                  </div>
                  <p className="mb-5">
                    {
                      'Please use your email and a password to sign up on NimbusPost, rather than using Google or Facebook account.'
                    }
                  </p>
                  <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                    <Input
                      prefix={<IoMdMail className="h-4 w-4" />}
                      label="Email"
                      placeholder="Email"
                      type="email"
                      {...register('partner.email')}
                      error={errors.partner?.email?.message}
                    />
                    <Input
                      label="Password"
                      placeholder="Password"
                      type="text"
                      {...register('partner.password')}
                      error={errors.partner?.password?.message}
                    />
                  </div>

                  <div className="grid-container1">
                    <Button
                      onClick={() => {
                        setStep(6);
                      }}
                      variant="outline"
                      className="mt-5 w-full"
                      type="button"
                      color="primary"
                    >
                      <MdKeyboardArrowLeft className="ml-3 h-4 w-4 text-gray-500" />
                      Prev
                    </Button>
                    <Button
                      isLoading={loading}
                      className=" mt-5"
                      type="submit"
                      color="primary"
                    >
                      Next
                      <MdKeyboardArrowRight className="ml-1 h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
