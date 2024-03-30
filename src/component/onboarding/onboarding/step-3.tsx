'use client';
import { Button, Input } from 'rizzui';
import cn from '@/utils/class-names';
import { FaHouseUser } from 'react-icons/fa';
import { Controller, SubmitHandler } from 'react-hook-form';
import FormSummary from './form-summary';
import { Step2Schema, step2Schema } from '@/utils/validators/onboarding.schema';
import { useContext, useState } from 'react';
import { Form } from '@/component/ui/form';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import axios from 'axios';
import { BaseApi, UpdateSeller } from '@/constants/index';
import { toast } from 'sonner';
import SelectLoader from '@/component/loader/select-loader';
import dynamic from 'next/dynamic';
import { OnboardingContext } from '@/store/onboarding/context';
import { states } from '@/constants/states';
import { useCookies } from 'react-cookie';
import { extractPathAndParams } from '@/utils/urlextractor';
const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

export default function StepThree({ step, setStep }: any) {
  const { setOnboarding, state } = useContext(OnboardingContext);
  const [cookies] = useCookies(['admintoken']);

  const seller = state?.onboarding;
  const initialValues: Step2Schema = {
    address1: seller?.shopaddress?.address1 ?? '',
    address2: seller?.shopaddress?.address2 ?? '',
    landmark: seller?.shopaddress?.landmark ?? '',
    city: seller?.shopaddress?.city ?? '',
    state: seller?.shopaddress?.state ?? '',
    pincode: seller?.shopaddress?.pincode ?? '',
  };
  const [reset, _setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Step2Schema> = (data) => {
    setLoading(true);
    axios
      .patch(
        `${BaseApi}${UpdateSeller}/${seller?.id}`,
        {
          shopaddress: data,
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
          setStep(4);
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
            step={3}
            title="Where Can Customers Find You ?"
            description="Provide the address details of your store so that customers can easily locate and reach out to you. Accurate location information ensures a smooth shopping experience for your customers."
          />
        </div>

        <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
          <div className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0">
            <Form<Step2Schema>
              validationSchema={step2Schema}
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
                <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2 @2xl:pt-9 @3xl:pt-4 @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                  <Input
                    prefix={<FaHouseUser className="h-4 w-4" />}
                    label="Shop Address"
                    placeholder="Shop Address"
                    className="col-span-full"
                    {...register('address1')}
                    error={errors.address1?.message}
                  />
                  <Input
                    prefix={<FaHouseUser className="h-4 w-4" />}
                    label="Address 2"
                    placeholder="Address 2"
                    type="text"
                    {...register('address2')}
                    error={errors.address2?.message}
                  />

                  <Input
                    prefix={<FaHouseUser className="h-4 w-4" />}
                    label="Landmark"
                    placeholder="Landmark"
                    {...register('landmark')}
                    error={errors.landmark?.message}
                  />
                  <Input
                    prefix={<FaHouseUser className="h-4 w-4" />}
                    label="City"
                    placeholder="City"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  <Input
                    prefix={<FaHouseUser className="h-4 w-4" />}
                    label="Pincode"
                    placeholder="Pincode"
                    {...register('pincode')}
                    error={errors.pincode?.message}
                  />

                  <Controller
                    name="state"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        className={'col-span-full'}
                        label="Select State"
                        options={states}
                        value={value}
                        onChange={onChange}
                        placeholder="Select State"
                        error={errors.state?.message}
                        getOptionValue={(option) => option.value}
                        getOptionDisplayValue={(option) => option.name}
                      />
                    )}
                  />

                  <Button
                    onClick={() => {
                      setStep(2);
                    }}
                    variant="outline"
                    className="w-full"
                    type="button"
                    color="primary"
                  >
                    <MdKeyboardArrowLeft className="ml-3 h-4 w-4 text-gray-500" />
                    Prev
                  </Button>

                  <Button
                    isLoading={loading}
                    className="w-full"
                    type="submit"
                    color="primary"
                  >
                    Next
                    <MdKeyboardArrowRight className="ml-3 h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
