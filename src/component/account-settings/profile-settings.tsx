'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiEnvelopeSimple } from 'react-icons/pi';
import { Form } from '@/component/ui/form';
import { Text } from '@/component/ui/text';
import { Input } from '@/component/ui/input';
import {
  profileFormSchema,
  ProfileFormTypes,
} from '@/utils/validators/profile-settings.schema';
import FormGroup from '../others/form-group';
import FormFooter from '../others/form-footer';
import cn from '@/utils/class-names';
import { useLayout } from '@/hooks/use-layout';
import { useBerylliumSidebars } from '@/layouts/beryllium/beryllium-utils';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, errorRetry, singleSeller, updateSeller } from '@/constants';
import { useModal } from '../modal-views/use-modal';
import { Button } from 'rizzui';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Spinner from '../ui/spinner';
import { SellerContext } from '@/store/seller/context';
import Link from 'next/link';
import { PhoneNumber } from '../ui/phone-input';
import AvatarUploadS3 from '../ui/file-upload/avatar-upload-s3';
import { useCookies } from 'react-cookie';
import { extractPathAndParams } from '@/utils/urlextractor';
import { fetcher } from '@/constants/fetcher';
const QuillEditor = dynamic(() => import('@/component/ui/quill-editor'), {
  ssr: false,
});

function setFormattedDate(dateString: any) {
  const dateParts = dateString?.split('T')[0].split('-');
  const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
  return formattedDate;
}

function convertToDbDateFormat(formattedDate: any) {
  const dateParts = formattedDate.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  return `${year}-${month}-${day}T00:00:00.000Z`;
}

export default function ProfileSettingsView() {
  const { state, setSeller } = useContext(SellerContext);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['admintoken']);

  const onSubmit: SubmitHandler<ProfileFormTypes> = (data) => {
    setLoading(true);
    axios
      .patch(
        `${BaseApi}${updateSeller}/${params?.seller}`,
        {
          ...data,
          cover: data?.cover?.url,
          onboardAt: convertToDbDateFormat(data?.onboardAt),
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      )
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          setSeller(res.data?.data);
          return toast.success('Profile successfully updated!');
        } else {
          return toast.error('Something went wrong !');
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
        return toast.error('Something went wrong !');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const params = useParams();

  let {
    data: seller,
    isLoading,
    error,
  } = useSWR(
    `${BaseApi}${singleSeller}/${params?.seller}`,
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

  seller = seller?.data?.user;

  const data = {
    ...state?.seller,
    cover: {
      name: state?.seller?.username,
      url: state?.seller?.cover,
      size: 1024,
    },
  };

  const defaultValues = {
    username: data?.username ?? '',
    shopname: data?.shopname ?? '',
    email: data?.email ?? '',
    mobileNo: data?.mobileNo ?? '',
    alternatemobileNo: data?.alternatemobileNo ?? '',
    description: data?.description ?? '',
    cover: data?.cover ?? undefined,
    discount: data?.discount ?? '',
    charge: data?.charge ?? '',
    rating: data?.rating ?? '',
    priorCharge: data?.priorCharge ?? '',
    onboardAt: data?.onboardAt && setFormattedDate(data?.onboardAt),
  };

  const { openModal } = useModal();

  useEffect(() => {
    if (seller) {
      setSeller(seller);
    }
    if (seller && !seller?.isOnboarded) {
      openModal({
        view: <Onboarded user={seller?.shopname} />,
        customSize: '250px',
      });
    }
  }, [seller]);

  if (authstatus) {
    localStorage.removeItem('admin');
    toast.error('Session Expired');
    const currentUrl = window.location.href;
    const path = extractPathAndParams(currentUrl);
    if (typeof window !== 'undefined') {
      location.href = `/auth/sign-in?ref=${path}`;
    }
  }

  if (isLoading) {
    return (
      <div className="mt-10">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-10">
        <Text className="text-center">Something went wrong !</Text>
      </div>
    );
  }
  if (seller) {
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
                <ProfileHeader url={state?.seller?.cover}>
                  <div className="w-full sm:w-auto md:ms-auto"></div>
                </ProfileHeader>

                <div className="mx-auto mb-10 grid w-full max-w-screen-2xl gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                  <FormGroup
                    title="Username"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <Input
                      className="col-span-full"
                      prefix="https://smallkart.com/@"
                      placeholder="Username"
                      // disabled
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      {...register('username')}
                      error={errors.username?.message}
                    />
                  </FormGroup>

                  <FormGroup
                    title="Shop Name"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <Input
                      type="text"
                      className="col-span-full"
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      placeholder="Enter your Shop Name"
                      {...register('shopname')}
                      error={errors.shopname?.message}
                    />
                  </FormGroup>

                  <FormGroup
                    title="Cover Photo"
                    description="This will be displayed on your profile."
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <div className="col-span-2 flex flex-col items-center gap-4 @xl:flex-row">
                      <AvatarUploadS3
                        name="cover"
                        setValue={setValue}
                        getValues={getValues}
                        error={errors?.cover?.message as string}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup
                    title="Description"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <div className="@3xl:col-span-2">
                      <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                          <QuillEditor
                            value={value}
                            onChange={onChange}
                            className="[&>.ql-container_.ql-editor]:min-h-[100px]"
                          />
                        )}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup
                    title="Contact Details"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                    description="Enter an  email if you’d like to be contacted via a email."
                  >
                    <Input
                      prefix={
                        <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                      }
                      type="email"
                      // disabled
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
                          label="Altenate Phone Number"
                          country="in"
                          value={value}
                          onChange={onChange}
                          placeholder="Alternate Phone Number"
                          error={errors.alternatemobileNo?.message}
                        />
                      )}
                    />
                    {/* <Input
                      prefix={<FaPhoneAlt className="h-4 w-4 text-gray-500" />}
                      type="text"
                      className="col-span-full"
                      placeholder="1234567890"
                      {...register('alternatemobileNo')}
                      error={errors.alternatemobileNo?.message}
                    /> */}
                  </FormGroup>

                  <FormGroup
                    title="Discount"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <Input
                      type="text"
                      className="col-span-full"
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      placeholder="Discount"
                      {...register('discount')}
                      error={errors.discount?.message}
                    />
                  </FormGroup>

                  <FormGroup
                    title="Rating"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <Input
                      type="text"
                      className=""
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      placeholder="Rating"
                      {...register('rating.rate')}
                      error={errors.rating?.rate?.message}
                    />
                    <Input
                      type="text"
                      className=""
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      placeholder="Rating total"
                      {...register('rating.total')}
                      error={errors.rating?.total?.message}
                    />
                  </FormGroup>
                  {data?.referredBy && (
                    <FormGroup
                      title="Referred By"
                      className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                    >
                      <Link href={`/users/${data?.referredBy?.id}/view`}>
                        <Input
                          type="text"
                          className="cursor-pointer"
                          prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                          readOnly
                          placeholder="User Name"
                          value={data?.referredBy?.name || ''}
                        />
                      </Link>
                      <Link
                        className="cursor-pointer"
                        href={`/users/${data?.referredBy?.id}/view`}
                      >
                        <Input
                          type="text"
                          className="cursor-pointer"
                          prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                          readOnly
                          placeholder="User Email"
                          value={data?.referredBy?.email || ''}
                        />
                      </Link>
                    </FormGroup>
                  )}

                  <FormGroup
                    title="Charge"
                    className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    <Input
                      type="text"
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      placeholder="Charge"
                      {...register('charge')}
                      error={errors.charge?.message}
                    />
                    <Input
                      type="text"
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      placeholder="priorCharge"
                      {...register('priorCharge')}
                      error={errors.priorCharge?.message}
                    />
                    <Input
                      type="date"
                      className="col-span-full"
                      prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                      placeholder="onboardAt"
                      {...register('onboardAt')}
                      error={errors.onboardAt?.message}
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
          alt="cover"
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
