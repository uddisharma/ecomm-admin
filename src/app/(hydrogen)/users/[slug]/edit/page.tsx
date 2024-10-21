'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Input } from '@/component/ui/input';
import FormGroup from '@/component/others/form-group';
import FormFooter from '@/component/others/form-footer';
import cn from '@/utils/class-names';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import PageHeader from '@/component/others/pageHeader';
import Link from 'next/link';
import TrashIcon from '@/component/icons/trash';
import { PiPlusBold } from 'react-icons/pi';
import dynamic from 'next/dynamic';
import SelectLoader from '@/component/loader/select-loader';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, errorRetry, singleUser, updateUser } from '@/constants';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/component/ui/spinner';
import { states } from '@/constants/states';
import { useCookies } from 'react-cookie';
import { fetcher } from '@/constants/fetcher';
import { extractPathAndParams } from '@/utils/urlextractor';

const Select = dynamic(() => import('@/component/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});

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

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);

  const pageHeader = {
    title: 'Edit User',
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
        name: 'Edit',
      },
    ],
  };

  const params = useParams();
  const router = useRouter();

  const [cookies] = useCookies(['admintoken']);

  let {
    data,
    isLoading: loading,
    error,
  } = useSWR(
    `${BaseApi}${singleUser}/${params?.slug}`,
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

  const user = data?.data;

  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    mobileNo: '',
  });
  const { name, email, mobileNo } = personal;

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

  useEffect(() => {
    if (user && user?.name) {
      setPersonal({
        ...personal,
        name: user?.name,
        mobileNo: user?.mobileNo,
        email: user?.email,
      });
      setWarehouses(user?.shippingAddress);
    }
  }, [user]);
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

      // Add more validations for other fields...

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
      .patch(
        `${BaseApi}${updateUser}/${params?.slug}`,
        {
          ...personal,
          userType: 1,
          shippingAddress: warehouses,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      )
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          router.back();
          return toast.success('User Updated Successfully !');
        } else {
          return toast.error('Something went wrong !');
        }
      })
      .catch((err: any) => {
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

  if (authstatus) {
    localStorage.removeItem('admin');
    toast.error('Session Expired');
    const currentUrl = window.location.href;
    const path = extractPathAndParams(currentUrl);
    if (typeof window !== 'undefined') {
      location.href = `/auth/sign-in?ref=${path}`;
    }
  }

  if (loading) {
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={`/users`} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
          <Button
            tag="span"
            variant="outline"
            className="mt-4 w-full cursor-pointer lg:mt-0 lg:w-auto "
          >
            View all Users
          </Button>
        </Link>
      </PageHeader>
      {loading && (
        <div style={{ paddingBottom: '100px' }}>{loading && <Spinner />}</div>
      )}
    </div>;
  } else if (error) {
    return (
      <div>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <Link href={`/users`} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer lg:mt-0 lg:w-auto "
            >
              View all Users
            </Button>
          </Link>
        </PageHeader>
        {error && (
          <div style={{ paddingBottom: '100px' }}>
            <Empty
              image={<SearchNotFoundIcon />}
              text="Something Went Wrong !"
              className="h-full justify-center"
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={`/users`} className="mt-4 w-full @lg:mt-0 @lg:w-auto">
          <Button
            tag="span"
            variant="outline"
            className="mt-4 w-full cursor-pointer lg:mt-0 lg:w-auto "
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
                className="pt-5 @2xl:pt-7 @3xl:pt-9"
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
              </FormGroup>
              <FormGroup
                title="Shipping Address"
                description="Add User's Shipping Address"
                className={' pt-5 @2xl:pt-7 @3xl:pt9'}
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
