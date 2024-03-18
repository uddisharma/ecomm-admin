'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
import FormGroup from '@/component/others/form-group';
import FormFooter from '@/component/others/form-footer';
import cn from '@/utils/class-names';
import { Button, Text } from 'rizzui';
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import TrashIcon from '@/component/icons/trash';
import { PiPlusBold } from 'react-icons/pi';
import { userSchema, UserInput } from '@/utils/validators/users.schema';
import dynamic from 'next/dynamic';
import SelectLoader from '@/component/loader/select-loader';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { FiChevronsRight } from 'react-icons/fi';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, createUser } from '@/constants';

const initialValues = {
  password: '',
  mobileNo: '',
  email: '',
  name: '',
  shippingAddress: [
    {
      name: '',
      phone: '',
      phone1: '',
      email: '',
      pincode: '',
      address: '',
      landmark: '',
      city: '',
      district: '',
      state: '',
    },
  ],
};

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

interface Warehouse {
  name: string;
  phone: string;
  phone1: string;
  email: string;
  pincode: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
}

interface FormError {
  name: string;
  phone: string;
  phone1: string;
  email: string;
  pincode: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
}

interface StepSixProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);

  const pageHeader = {
    title: 'Create User',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/users',
        name: 'User',
      },
      {
        name: 'Create',
      },
    ],
  };

  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: '',
  });
  const { name, email, mobileNo, password } = personal;

  const handleChange = (e: any) => {
    setPersonal({ ...personal, [e?.target?.name]: e.target?.value });
  };

  const [warehouses, setWarehouses] = useState<any>([
    {
      name: '',
      phone: '',
      phone1: '',
      email: '',
      pincode: '',
      address: '',
      landmark: '',
      city: '',
      district: '',
      state: '',
    },
  ]);
  const [errors, setErrors] = useState<any>([]);

  const addWarehouse = () => {
    setWarehouses([
      ...warehouses,
      {
        name: '',
        phone: '',
        phone1: '',
        email: '',
        pincode: '',
        address: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
      },
    ]);
    setErrors([...errors, {}]);
  };

  const removeWarehouse = (index: number) => {
    const updatedWarehouses = [...warehouses];
    updatedWarehouses.splice(index, 1);
    setWarehouses(updatedWarehouses);

    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    const newErrors: FormError[] = [];

    warehouses.forEach((warehouse: any, index: any) => {
      const warehouseErrors: any = {};

      // Validate each field manually
      if (!warehouse.name.trim()) {
        warehouseErrors.name = 'Name is required';
      }
      if (!warehouse.phone.trim()) {
        warehouseErrors.phone = 'Phone Number is required';
      }
      if (!warehouse.phone1.trim()) {
        warehouseErrors.phone1 = 'Alternate Phone Number is required';
      }
      if (!warehouse.email.trim()) {
        warehouseErrors.email = 'Email is required';
      }
      if (!warehouse.pincode.trim()) {
        warehouseErrors.pincode = 'Pincode is required';
      }
      if (!warehouse.address.trim()) {
        warehouseErrors.address = 'Address is required';
      }
      if (!warehouse.landmark.trim()) {
        warehouseErrors.landmark = 'Landmark is required';
      }
      if (!warehouse.city.trim()) {
        warehouseErrors.city = 'City is required';
      }
      if (!warehouse.district.trim()) {
        warehouseErrors.district = 'District is required';
      }
      if (!warehouse.state.trim()) {
        warehouseErrors.state = 'State is required';
      }

      newErrors[index] = warehouseErrors;
    });

    setErrors(newErrors);
    return newErrors.every((error) => Object.keys(error).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [warehouses]);

  const handleInputChange =
    (index: number, field: keyof Warehouse) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const updatedWarehouses = [...warehouses];
      updatedWarehouses[index][field] = e.target.value;
      setWarehouses(updatedWarehouses);
    };

  const validateForm1 = (data: any) => {
    if (
      data?.name == '' ||
      data?.email == '' ||
      data?.mobileNo == '' ||
      data?.password == ''
    ) {
      return false;
    }
    return true;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !validateForm1(personal)) {
      toast.warning('All fields are required');
    }
    setIsLoading(true);
    axios
      .post(`${BaseApi}${createUser}`, {
        ...personal,
        userType: 1,
        shippingAddress: warehouses,
      })
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          return toast.success('User Created Successfully !');
        } else if (res?.data?.status == 'EXIST') {
          return toast.warning(res?.data?.message);
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

  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={`/users`} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            View all Users
          </Button>
        </Link>
      </PageHeader>

      <div
        style={{ marginTop: '-30px' }}
        className={cn(
          'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium '
        )}
      >
        <div>
          <form onSubmit={onSubmit} className=" ">
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="User Details"
                description="Personal Details of User"
                className="pt-7 @2xl:pt-9 @3xl:pt-11"
              >
                <Input
                  label="Name"
                  placeholder="Name"
                  name="name"
                  value={name}
                  required
                  onChange={handleChange}
                />

                <Input
                  label="Email"
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={email}
                  required
                  onChange={handleChange}
                />

                <Input
                  label="Mobile Number"
                  placeholder="Mobile Number"
                  name="mobileNo"
                  type="number"
                  maxLength={10}
                  required
                  value={mobileNo}
                  onChange={handleChange}
                />

                <Input
                  label="Password"
                  placeholder="Password"
                  type="text"
                  name="password"
                  required
                  value={password}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup
                title="Shipping Address"
                description="Add User's Shipping Address"
                className={' pt-7 @2xl:pt-9 @3xl:pt-11'}
              >
                <div className="col-span-full">
                  <div className="col-span-full">
                    {warehouses.map((warehouse: any, index: any) => (
                      <div
                        key={index}
                        className="grid-container1 mt-3 rounded-lg border border-gray-300 p-5"
                      >
                        <Input
                          placeholder="Name"
                          className="flex-grow"
                          label="Name"
                          value={warehouse.name}
                          onChange={handleInputChange(index, 'name')}
                          error={errors[index]?.name && errors[index].name}
                        />
                        <Input
                          placeholder="Phone Number"
                          className="flex-grow"
                          label="Phone Number"
                          value={warehouse.phone}
                          type="number"
                          onChange={handleInputChange(index, 'phone')}
                          error={errors[index]?.phone && errors[index].phone}
                        />
                        <Input
                          placeholder="Altenate Phone Number"
                          className="flex-grow"
                          label="Alternate Phone Numbner"
                          value={warehouse.phone1}
                          type="number"
                          onChange={handleInputChange(index, 'phone1')}
                          error={errors[index]?.phone1 && errors[index].phone1}
                        />
                        <Input
                          placeholder="Email"
                          className="flex-grow"
                          label="Email"
                          type="email"
                          value={warehouse.email}
                          onChange={handleInputChange(index, 'email')}
                          error={errors[index]?.email && errors[index].email}
                        />
                        <Input
                          placeholder="Address"
                          className="flex-grow"
                          label="Address"
                          value={warehouse.address}
                          onChange={handleInputChange(index, 'address')}
                          error={
                            errors[index]?.address && errors[index].address
                          }
                        />
                        <Input
                          placeholder="Landmark"
                          className="flex-grow"
                          label="Landmark"
                          value={warehouse.landmark}
                          onChange={handleInputChange(index, 'landmark')}
                          error={
                            errors[index]?.landmark && errors[index].landmark
                          }
                        />
                        <Input
                          placeholder="City"
                          className="flex-grow"
                          label="City"
                          value={warehouse.city}
                          onChange={handleInputChange(index, 'city')}
                          error={errors[index]?.city && errors[index].city}
                        />
                        <Input
                          placeholder="Pincode"
                          className="flex-grow"
                          type="number"
                          label="Pincode"
                          value={warehouse.pincode}
                          onChange={handleInputChange(index, 'pincode')}
                          error={
                            errors[index]?.pincode && errors[index].pincode
                          }
                        />
                        <Input
                          placeholder="District"
                          className="flex-grow"
                          label="District"
                          value={warehouse.district}
                          onChange={handleInputChange(index, 'district')}
                          error={
                            errors[index]?.district && errors[index].district
                          }
                        />

                        <Select
                          label="Select State"
                          options={states}
                          placeholder="Select State"
                          getOptionValue={(option) => option.value}
                          getOptionDisplayValue={(option) => option.name}
                          value={warehouse.state}
                          onChange={(e) => {
                            const updatedWarehouses: any = [...warehouses];
                            updatedWarehouses[index]['state'] = e;
                            setWarehouses(updatedWarehouses);
                          }}
                          // onChange={handleInputChange(index, 'state')}
                          error={errors[index]?.state && errors[index].state}
                        />

                        <div>
                          {warehouses.length > 1 && (
                            <Button
                              onClick={() => removeWarehouse(index)}
                              variant="outline"
                              className="col-span-full ml-auto mt-3 w-auto"
                            >
                              <TrashIcon className="me-2 h-4 w-4" />
                              Remove Address
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={addWarehouse}
                    variant="outline"
                    className="col-span-full ml-auto mt-5 flex w-auto flex-row justify-end"
                  >
                    <PiPlusBold className="me-2 h-4 w-4" /> Add Address
                  </Button>
                </div>
              </FormGroup>
            </div>
            <FormFooter
              isLoading={isLoading}
              altBtnText="Cancel"
              submitBtnText="Save"
            />
          </form>
        </div>
      </div>
    </>
  );
}
