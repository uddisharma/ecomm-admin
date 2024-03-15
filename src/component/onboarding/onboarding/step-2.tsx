'use client';

import { Textarea, Button, Input, Text, Title } from 'rizzui';
import { LuInstagram } from 'react-icons/lu';
import cn from '@/utils/class-names';
import { FaFacebook, FaHouseUser, FaYoutube } from 'react-icons/fa';
import AvatarUpload from '@/component/ui/file-upload/avatar-upload';
import { IoMdMail } from 'react-icons/io';
import { Controller, SubmitHandler } from 'react-hook-form';
import { PhoneNumber } from '@/component/ui/phone-input';
import FormSummary from './form-summary';
import { Step1Schema, step1Schema } from '@/utils/validators/onboarding.schema';
import { CiAt } from 'react-icons/ci';
import { useContext, useState } from 'react';
import { Form } from '@/component/ui/form';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { UserContext } from '@/store/user/context';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, UpdateSeller } from '@/constants/index';
import { OnboardingContext } from '@/store/onboarding/context';

export default function StepTwo({ step, setStep }: any) {
  const { setOnboarding, state } = useContext(OnboardingContext);

  const seller = state?.onboarding;
  const initialValues: Step1Schema = {
    shopname: seller?.shopname ?? '',
    username: seller?.username ?? '',
    cover: seller?.cover
      ? { name: seller?.shopname, size: 1024, url: seller?.cover }
      : undefined,
    email: seller?.email ?? '',
    mobileNo: seller?.mobileNo ?? '',
    alternatemobileNo: seller?.alternatemobileNo ?? '',
    description: seller?.description ?? '',
    instagram: seller?.socialLinks?.instagram ?? '',
    facebook: seller?.socialLinks?.facebook ?? '',
    youtube: seller?.socialLinks?.youtube ?? '',
  };
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<Step1Schema> = (data) => {
    if (data?.cover == undefined) {
      return toast.warning('Please Add Shop Banner');
    }
    setLoading(true);
    axios
      .patch(`${BaseApi}${UpdateSeller}/${seller?.id}`, {
        ...data,
        cover: data?.cover?.url,
        socialLinks: {
          instagram: data?.instagram,
          facebook: data?.facebook,
          youtube: data?.youtube,
        },
      })
      .then((res) => {
        if (res?.data?.status == 'SUCCESS') {
          setOnboarding(res?.data?.data);
          setStep(3);
          return toast.success('Details saved Successfully');
        } else {
          toast.warning(res?.data?.message ?? 'Something went wrong!');
        }
      })
      .catch((err) => {
        console.log(err);
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
            step={2}
            title="Let Us Get to Know Your Store!"
            description=" Share key details about your store to help us tailor our services and highlight its unique features. Your store is more than just a business; it's an opportunity to connect with potential customers and stand out in the market."
          />
        </div>

        <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
          <div className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0">
            <Form<Step1Schema>
              validationSchema={step1Schema}
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
                    label="Shop Name"
                    placeholder="Shop Name"
                    className="col-span-full"
                    {...register('shopname')}
                    error={errors.shopname?.message}
                  />
                  <Input
                    prefix={<CiAt className="h-4 w-4" />}
                    label="Username (must be unique)"
                    placeholder="Username"
                    readOnly
                    type="text"
                    {...register('username')}
                    error={errors.username?.message}
                  />

                  <Input
                    prefix={<IoMdMail className="h-4 w-4" />}
                    label="Email"
                    placeholder="Email"
                    type="email"
                    readOnly
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <Controller
                    name="mobileNo"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <PhoneNumber
                        label="Phone Number"
                        country="in"
                        value={value}
                        onChange={onChange}
                        placeholder="Phone Number"
                        error={errors.mobileNo?.message}
                      />
                    )}
                  />
                  <Controller
                    name="alternatemobileNo"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <PhoneNumber
                        label="Alternate Phone Number"
                        country="in"
                        value={value}
                        onChange={onChange}
                        placeholder="Alternate Phone Number"
                        error={errors.alternatemobileNo?.message}
                      />
                    )}
                  />
                  <Textarea
                    className="col-span-full"
                    label="Description"
                    placeholder="Write about your shop..."
                    {...register('description')}
                    error={errors.description?.message}
                  />
                  <div className="grid-container1 col-span-full rounded-lg border border-gray-300 p-4">
                    <div className="m-auto mt-14">
                      <h4 className="text-base font-medium">Shop Banner</h4>
                      <p className="mt-2">
                        This will be displayed on your profile.
                      </p>
                    </div>
                    <div className="m-auto ">
                      <AvatarUpload
                        name="cover"
                        setValue={setValue}
                        getValues={getValues}
                        error={errors.cover?.message}
                      />
                    </div>
                  </div>
                  <Input
                    prefix={<FaYoutube className="h-4 w-4 text-gray-500" />}
                    type="url"
                    className="col-span-full"
                    placeholder="https://youtube.com"
                    {...register('youtube')}
                    error={errors.youtube?.message}
                  />

                  <Input
                    prefix={<FaFacebook className="h-4 w-4 text-gray-500" />}
                    type="url"
                    className="col-span-full"
                    placeholder="https://facebook.com"
                    {...register('facebook')}
                    error={errors.facebook?.message}
                  />

                  <Input
                    prefix={<LuInstagram className="h-4 w-4 text-gray-500" />}
                    type="url"
                    className="col-span-full"
                    placeholder="https://instagram.com"
                    {...register('instagram')}
                    error={errors.instagram?.message}
                  />

                  <Button
                    onClick={() => {
                      setStep(1);
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
                    className=" w-full"
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
