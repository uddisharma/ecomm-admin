'use client';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { Input } from '@/component/ui/input';
import { z } from 'zod';
import FormGroup from '../others/form-group';
import FormFooter from '../others/form-footer';
import { seller } from '@/data/category';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/store/user/context';
import { SellerContext } from '@/store/seller/context';
import dynamic from 'next/dynamic';
import SelectLoader from '../loader/select-loader';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, updateSeller } from '@/constants';
import { useParams, useRouter } from 'next/navigation';

const WarehouseSchema = z.object({
  address1: z.string().min(1, { message: 'Address  is required' }),
  address2: z.string().optional(),
  landmark: z.string().min(1, { message: 'Landmark is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  pincode: z.string().min(1, { message: 'Pincode is required' }),
  state: z.string().min(1, { message: 'State  is required' }),
});
type WarehouseFormTypes = z.infer<typeof WarehouseSchema>;

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const states = [
  { name: 'Andhra Pradesh', value: 'Andhra Pradesh' },
  { name: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
  { name: 'Assam', value: 'Assam' },
  { name: 'Bihar', value: 'Bihar' },
  { name: 'Chhattisgarh', value: 'Chhattisgarh' },
  { name: 'Goa', value: 'Goa' },
  { name: 'Gujarat', value: 'Gujarat' },
  { name: 'Haryana', value: 'Haryana' },
  { name: 'Himachal Pradesh', value: 'Himachal Pradesh' },
  { name: 'Jharkhand', value: 'Jharkhand' },
  { name: 'Karnataka', value: 'Karnataka' },
  { name: 'Kerala', value: 'Kerala' },
  { name: 'Madhya Pradesh', value: 'Madhya Pradesh' },
  { name: 'Maharashtra', value: 'Maharashtra' },
  { name: 'Manipur', value: 'Manipur' },
  { name: 'Meghalaya', value: 'Meghalaya' },
  { name: 'Mizoram', value: 'Mizoram' },
  { name: 'Nagaland', value: 'Nagaland' },
  { name: 'Odisha', value: 'Odisha' },
  { name: 'Punjab', value: 'Punjab' },
  { name: 'Rajasthan', value: 'Rajasthan' },
  { name: 'Sikkim', value: 'Sikkim' },
  { name: 'Tamil Nadu', value: 'Tamil Nadu' },
  { name: 'Telangana', value: 'Telangana' },
  { name: 'Tripura', value: 'Tripura' },
  { name: 'Uttar Pradesh', value: 'Uttar Pradesh' },
  { name: 'Uttarakhand', value: 'Uttarakhand' },
  { name: 'West Bengal', value: 'West Bengal' },
];

export default function ProfileSettingsView() {
  const [isloading, setIsLoading] = useState(false);
  const { state, setSeller } = useContext(SellerContext);
  const params = useParams();
  const router = useRouter();
  // useEffect(() => {
  //   if (!state?.seller?.shopaddress?.address1) {
  //     router.push(`/${params?.seller}/shop`);
  //   }
  // }, [state]);
  const onSubmit: SubmitHandler<WarehouseFormTypes> = (data) => {
    setIsLoading(true);
    axios
      .patch(`${BaseApi}${updateSeller}/${params?.seller}`, {
        shopaddress: data,
      })
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
        return toast.error('Something went wrong !');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const defaultValues = {
    address1: state?.seller?.shopaddress?.address1 ?? '',
    address2: state?.seller?.shopaddress?.address2 ?? '',
    landmark: state?.seller?.shopaddress?.landmark ?? '',
    city: state?.seller?.shopaddress?.city ?? '',
    pincode: state?.seller?.shopaddress?.pincode ?? '',
    state: state?.seller?.shopaddress?.state ?? '',
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
                  title="Warehouse"
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
                  <br />
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
