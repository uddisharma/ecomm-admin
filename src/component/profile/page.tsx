'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiEnvelopeSimple } from 'react-icons/pi';
import { Form } from '@/component/ui/form';
import { Text } from '@/component/ui/text';
import { Input } from '@/component/ui/input';
import AvatarUpload from '@/component/ui/file-upload/avatar-upload';
import FormGroup from '../others/form-group';
import FormFooter from '../others/form-footer';
import cn from '@/utils/class-names';
import { useLayout } from '@/hooks/use-layout';
import { useBerylliumSidebars } from '@/layouts/beryllium/beryllium-utils';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { useContext, useState } from 'react';
import { UserContext } from '@/store/user/context';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, adminUpdate } from '@/constants';
import { Button } from 'rizzui';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PhoneNumber } from '../ui/phone-input';
import { z } from 'zod';
import { fileSchema, validateEmail } from '@/utils/validators/common-rules';

const profileFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: validateEmail,
  mobileNo: z.string().min(1, { message: 'Mobile Number is required' }),
  profile: fileSchema.optional(),
});

// generate form types from zod validation schema
type ProfileFormTypes = z.infer<typeof profileFormSchema>;

export default function ProfileSettingsView() {
  const { state, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<ProfileFormTypes> = (data) => {
    if (!data?.profile?.url) {
      return toast.warning('Profile photo is required');
    }
    setLoading(true);
    axios
      .patch(`${BaseApi}${adminUpdate}/${state?.user?.id}`, {
        ...data,
        profile: data?.profile?.url,
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          setUser(res.data?.data);
          return toast.success('Profile successfully updated!');
        } else {
          return toast.error('Something went wrong !');
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const data = {
    ...state?.user,
    profile: {
      name: state?.user?.name,
      url: state?.name?.profile,
      size: 1024,
    },
  };

  const defaultValues = {
    name: data?.name ?? '',
    email: data?.email ?? '',
    mobileNo: data?.mobileNo ?? '',
    profile: data?.profile ?? undefined,
  };

  return (
    <>
      <Form<ProfileFormTypes>
        validationSchema={profileFormSchema}
        onSubmit={onSubmit}
        className="@container"
        useFormProps={{
          mode: 'onChange',
          defaultValues,
        }}
      >
        {({
          register,
          control,
          getValues,
          setValue,
          formState: { errors },
        }) => {
          return (
            <>
              <ProfileHeader url={state?.user?.profile}>
                <div className="w-full sm:w-auto md:ms-auto"></div>
              </ProfileHeader>

              <div className="mx-auto mb-10 grid w-full max-w-screen-2xl gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                <FormGroup
                  title="Profile Photo"
                  description="This will be displayed on your profile."
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <div className="col-span-2 flex flex-col items-center gap-4 @xl:flex-row">
                    <AvatarUpload
                      name="profile"
                      setValue={setValue}
                      getValues={getValues}
                      error={errors?.profile?.message as string}
                    />
                  </div>
                </FormGroup>

                <FormGroup
                  title="Personal Details"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  description="Enter an  email if you’d like to be contacted via a email."
                >
                  <Input
                    type="text"
                    label="Name"
                    className="col-span-full"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    placeholder="Name"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                  <Input
                    prefix={
                      <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                    }
                    type="email"
                    // disabled
                    label="Email"
                    className="col-span-full"
                    placeholder="youremail@gmail.com"
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
                        className="col-span-full"
                        value={value}
                        onChange={onChange}
                        placeholder="Phone Number"
                        error={errors.mobileNo?.message}
                      />
                    )}
                  />
                </FormGroup>
              </div>
              <FormFooter
                isLoading={loading}
                altBtnText="Cancel"
                submitBtnText="Save"
              />
            </>
          );
        }}
      </Form>
    </>
  );
}

export function ProfileHeader({
  url,
  children,
}: React.PropsWithChildren<{ url: string }>) {
  const { layout } = useLayout();
  const { expandedLeft } = useBerylliumSidebars();

  return (
    <div
      className={cn(
        layout === LAYOUT_OPTIONS.BERYLLIUM && expandedLeft
          ? 'before:start-5 3xl:before:start-[25px]'
          : 'xl:before:w-[calc(100%_+_10px)]'
      )}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-wrap items-end justify-start gap-6 border-b border-dashed border-gray-300 pb-10">
        <Image
          src={url}
          width={1600}
          height={200}
          style={{
            maxHeight: '300px',
            borderRadius: '10px',
            marginTop: '10px',
          }}
          alt="profile"
        />

        {children}
      </div>
    </div>
  );
}

const Onboarded = ({ user }: any) => {
  const params = useParams();
  return (
    <div className="p-10">
      <Text className="text-center">{user} is not onboarded yet!</Text>
      <br />
      <Link href={`/${params?.seller}/shop/onboarding`}>
        <Button className="m-auto block" variant="solid" color="danger">
          Onboard Now
        </Button>
      </Link>
    </div>
  );
};
