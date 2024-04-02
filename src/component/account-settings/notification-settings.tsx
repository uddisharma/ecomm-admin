'use client';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { Input } from '@/component/ui/input';
import { z } from 'zod';
import FormGroup from '../others/form-group';
import FormFooter from '../others/form-footer';
import { useContext, useState } from 'react';
import { SellerContext } from '@/store/seller/context';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BaseApi, updateSeller } from '@/constants';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import SelectLoader from '../loader/select-loader';
import { PhoneNumber } from '../ui/phone-input';
import { extractPathAndParams } from '@/utils/urlextractor';
import { useCookies } from 'react-cookie';
import { states } from '@/constants/states';
import AvatarUploadS3 from '../ui/file-upload/avatar-upload-s3';
import { fileSchema } from '@/utils/validators/common-rules';

const WarehouseSchema = z.object({
  name: z.string().min(1, { message: 'Name  is required' }),
  email: z.string().min(1, { message: 'Email  is required' }),
  phone: z.string().min(1, { message: 'Phone  is required' }),
  address1: z.string().min(1, { message: 'Address  is required' }),
  address2: z.string().optional(),
  landmark: z.string().min(1, { message: 'Landmark is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  pincode: z.string().min(1, { message: 'Pincode is required' }),
  state: z.string().min(1, { message: 'State  is required' }),
  signature: fileSchema,
});
type WarehouseFormTypes = z.infer<typeof WarehouseSchema>;

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

export default function ProfileSettingsView() {
  const [isloading, setIsLoading] = useState(false);
  const { state, setSeller } = useContext(SellerContext);
  const params = useParams();
  const [cookies] = useCookies(['admintoken']);

  const onSubmit: SubmitHandler<WarehouseFormTypes> = (data) => {
    setIsLoading(true);
    axios
      .patch(
        `${BaseApi}${updateSeller}/${params?.seller}`,
        {
          owner: {
            personal: {
              name: data?.name,
              email: data?.email,
              phone: data?.phone,
            },
            address: {
              address1: data?.address1,
              address2: data?.address2,
              landmark: data?.landmark,
              city: data?.city,
              state: data?.state,
              pincode: data?.pincode,
            },
            signature: data?.signature?.url,
          },
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
        setIsLoading(false);
      });
  };
  // useEffect(() => {
  //   if (!state?.seller?.owner?.personal?.name) {
  //     router.push(`/${params?.seller}/shop`);
  //   }
  // }, [state]);
  const defaultValues = {
    name: state?.seller?.owner?.personal?.name ?? '',
    email: state?.seller?.owner?.personal?.email ?? '',
    phone: state?.seller?.owner?.personal?.phone ?? '',
    address1: state?.seller?.owner?.address?.address1 ?? '',
    address2: state?.seller?.owner?.address?.address2 ?? '',
    landmark: state?.seller?.owner?.address?.landmark ?? '',
    city: state?.seller?.owner?.address?.city ?? '',
    pincode: state?.seller?.owner?.address?.pincode ?? '',
    state: state?.seller?.owner?.address?.state ?? '',
    signature: {
      name: state?.seller?.owner?.personal?.name ?? '',
      url: state?.seller?.owner?.signature ?? '',
      size: 1024,
    },
  };

  return (
    <>
      <Form<WarehouseFormTypes>
        validationSchema={WarehouseSchema}
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
              <div className="mx-auto mb-10 grid w-full max-w-screen-2xl gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                <FormGroup
                  title="Personal Details"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <Input
                    className="col-grow"
                    placeholder="Name"
                    label="Name"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Email"
                    label="Email"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  {/* <Input
                    className="col-grow"
                    placeholder="Phone"
                    label="Phone"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('phone')}
                    error={errors.phone?.message}
                  /> */}
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <PhoneNumber
                        label="Phone Number"
                        country="in"
                        value={value}
                        onChange={onChange}
                        placeholder="Phone Number"
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </FormGroup>
                <FormGroup
                  title="Address Details"
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <Input
                    className="col-grow"
                    placeholder="Address"
                    label="Address"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('address1')}
                    error={errors.address1?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Address 2"
                    label="Address 2"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('address2')}
                    error={errors.address2?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Landmark"
                    label="Landmark"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('landmark')}
                    error={errors.landmark?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="City"
                    label="City"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Pincode"
                    label="Pincode"
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('pincode')}
                    error={errors.pincode?.message}
                  />

                  <Controller
                    name="state"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select
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
                </FormGroup>
                <FormGroup
                  title="Owner Signature"
                  description="This will be displayed on your profile."
                  className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                >
                  <div className="col-span-2 flex flex-col items-center gap-4 @xl:flex-row">
                    <AvatarUploadS3
                      name="signature"
                      setValue={setValue}
                      getValues={getValues}
                      error={errors?.signature?.message as string}
                    />
                  </div>
                </FormGroup>
              </div>
              <FormFooter
                isLoading={isloading}
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
