'use client';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@/component/ui/form';
import { Input } from '@/component/ui/input';
import { z } from 'zod';
import FormGroup from '../others/form-group';
import FormFooter from '../others/form-footer';
import { useContext } from 'react';
import { UserContext } from '@/store/user/context';

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
});
type WarehouseFormTypes = z.infer<typeof WarehouseSchema>;
export default function ProfileSettingsView() {
  const onSubmit: SubmitHandler<WarehouseFormTypes> = (data) => {
    console.log(data);
  };
  const { state } = useContext(UserContext);

  const defaultValues = {
    name: state?.user?.owner?.personal?.name ?? '',
    email: state?.user?.owner?.personal?.email ?? '',
    phone: state?.user?.owner?.personal?.phone ?? '',
    address1: state?.user?.owner?.address?.address1 ?? '',
    address2: state?.user?.owner?.address?.address2 ?? '',
    landmark: state?.user?.owner?.address?.landmark ?? '',
    city: state?.user?.owner?.address?.city ?? '',
    pincode: state?.user?.owner?.address?.pincode ?? '',
    state: state?.user?.owner?.address?.state ?? '',
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
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Email"
                    label="Email"
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Phone"
                    label="Phone"
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('phone')}
                    error={errors.phone?.message}
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
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('address1')}
                    error={errors.address1?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Address 2"
                    label="Address 2"
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('address2')}
                    error={errors.address2?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Landmark"
                    label="Landmark"
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('landmark')}
                    error={errors.landmark?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="City"
                    label="City"
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="Pincode"
                    label="Pincode"
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('pincode')}
                    error={errors.pincode?.message}
                  />
                  <Input
                    className="col-grow"
                    placeholder="State"
                    label="State"
                    disabled
                    prefixClassName="relative pe-2.5 before:w-[1px] before:h-[38px] before:absolute before:bg-gray-300 before:-top-[9px] before:right-0"
                    {...register('state')}
                    error={errors.state?.message}
                  />
                </FormGroup>
              </div>
              {/* <FormFooter
                // isLoading={isLoading}
                altBtnText="Cancel"
                submitBtnText="Save"
              /> */}
            </>
          );
        }}
      </Form>
    </>
  );
}
