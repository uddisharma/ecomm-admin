import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useContext,
} from 'react';
import FormSummary from './form-summary';
import cn from '@/utils/class-names';
import { FiChevronsRight } from 'react-icons/fi';
import { Button, Input, Text } from 'rizzui';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { PiPlusBold } from 'react-icons/pi';
import TrashIcon from '@/component/icons/trash';
import { toast } from 'sonner';
import axios from 'axios';
import { BaseApi, UpdateSeller } from '@/constants/index';
import Hint2 from '../policies/hint2';
import { useModal } from '@/component/modal-views/use-modal';
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

interface Warehouse {
  warehouse_name: string;
  name: string;
  address: string;
  address_2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface FormError {
  warehouse_name?: string;
  name?: string;
  address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
}

interface StepSixProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const StepEight: React.FC<StepSixProps> = ({ step, setStep }: any) => {
  const { setOnboarding, state } = useContext(OnboardingContext);
  const [cookies] = useCookies(['admintoken']);
  const saved_warehouses =
    state?.onboarding?.deliverypartner?.partner?.warehouses;
  const personal = state?.onboarding?.deliverypartner?.personal;
  const partner = state?.onboarding?.deliverypartner?.partner;
  const [isLoading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(
    saved_warehouses && saved_warehouses?.length > 0
      ? saved_warehouses
      : [
          {
            warehouse_name: '',
            name: '',
            address: '',
            address_2: '',
            city: '',
            state: '',
            pincode: '',
            phone: '',
          },
        ]
  );
  const [errors, setErrors] = useState<FormError[]>([]);

  const addWarehouse = () => {
    setWarehouses([
      ...warehouses,
      {
        warehouse_name: '',
        name: '',
        address: '',
        address_2: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
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

    warehouses.forEach((warehouse, index) => {
      const warehouseErrors: FormError = {};

      // Validate each field manually
      if (!warehouse.warehouse_name.trim()) {
        warehouseErrors.warehouse_name = 'Warehouse Name is required';
      }
      if (!warehouse.name.trim()) {
        warehouseErrors.name = 'Name is required';
      }
      if (!warehouse.address.trim()) {
        warehouseErrors.address = 'Address is required';
      }
      if (!warehouse.address_2.trim()) {
        warehouseErrors.address_2 = 'Address 2 is required';
      }
      if (!warehouse.city.trim()) {
        warehouseErrors.city = 'City is required';
      }
      if (!warehouse.state.trim()) {
        warehouseErrors.state = 'State is required';
      }
      if (!warehouse.pincode.trim()) {
        warehouseErrors.pincode = 'Pincode is required';
      }
      if (!warehouse.phone.trim()) {
        warehouseErrors.phone = 'Phone is required';
      }

      // Add more validations for other fields...

      newErrors[index] = warehouseErrors;
    });

    setErrors(newErrors);
    return newErrors.every((error) => Object.keys(error).length === 0); // If no errors, the form is valid
  };

  useEffect(() => {
    validateForm();
  }, [warehouses]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      console.log({
        deliverypartner: {
          personal: personal,
          partner: {
            email: partner?.email,
            password: partner?.password,
            warehouses: warehouses,
          },
        },
      });
      axios
        .patch(
          `${BaseApi}${UpdateSeller}/${state?.onboarding?.id}`,
          {
            deliverypartner: {
              personal: personal,
              partner: {
                email: partner?.email,
                password: partner?.password,
                warehouses: warehouses,
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
            setStep(9);
            localStorage.removeItem('onboarding');

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
    } else {
      console.log('Form has errors');
      toast.error('Something went wrong');
    }
  };

  const handleInputChange =
    (index: number, field: keyof Warehouse) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const updatedWarehouses = [...warehouses];
      updatedWarehouses[index][field] = e.target.value;
      setWarehouses(updatedWarehouses);
    };
  const { openModal } = useModal();
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-screen-2xl grid-cols-12 place-content-center gap-6 px-5 py-10 @3xl:min-h-[calc(100vh-10rem)] @5xl:gap-8 @6xl:gap-16 xl:px-7'
      )}
    >
      <div className="col-span-full flex flex-col justify-center @5xl:col-span-5">
        <FormSummary
          className="@7xl:me-10"
          step={8}
          title="Add Delivery Partner Warehouses"
          description="Provide information about the warehouses associated with your delivery partner. This helps in managing the distribution of your products effectively."
        />
      </div>

      <div className="col-span-full flex items-center justify-center @5xl:col-span-7">
        <form
          onSubmit={onSubmit}
          className="flex-grow rounded-lg bg-white p-5 @4xl:p-7 dark:bg-gray-0"
        >
          <div className="col-span-full grid gap-4 rounded-lg @2xl:grid-cols-2  @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
            <div className="col-span-full">
              <div className="flex flex-row gap-5">
                <Text className="font-semibold text-gray-900">
                  Delivery Partner Warehouse
                </Text>
                <button
                  onClick={() => {
                    openModal({
                      view: <Hint2 />,
                      customSize: '900px',
                    });
                  }}
                  className="cursor-pointer font-semibold text-green-600"
                >
                  View Hint
                </button>
              </div>

              {warehouses.map((warehouse, index) => (
                <div
                  key={index}
                  className="grid-container1 mt-3 rounded-lg border border-gray-300 p-5"
                >
                  <Input
                    placeholder="Warehouse Name"
                    className="flex-grow"
                    label="Warehouse Name"
                    value={warehouse.warehouse_name}
                    onChange={handleInputChange(index, 'warehouse_name')}
                    error={
                      errors[index]?.warehouse_name &&
                      errors[index].warehouse_name
                    }
                  />
                  <Input
                    placeholder="Name"
                    className="flex-grow"
                    label="Name"
                    value={warehouse.name}
                    onChange={handleInputChange(index, 'name')}
                    error={errors[index]?.name && errors[index].name}
                  />
                  <Input
                    placeholder="Address"
                    className="flex-grow"
                    label="Address"
                    value={warehouse.address}
                    onChange={handleInputChange(index, 'address')}
                    error={errors[index]?.address && errors[index].address}
                  />
                  <Input
                    placeholder="Address 2"
                    className="flex-grow"
                    label="Address 2"
                    value={warehouse.address_2}
                    onChange={handleInputChange(index, 'address_2')}
                    error={errors[index]?.address_2 && errors[index].address_2}
                  />
                  <Input
                    placeholder="City"
                    className="flex-grow"
                    label="City"
                    value={warehouse.city}
                    onChange={handleInputChange(index, 'city')}
                    error={errors[index]?.city && errors[index].city}
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

                  <Input
                    placeholder="Pincode"
                    className="flex-grow"
                    type="number"
                    label="Pincode"
                    value={warehouse.pincode}
                    onChange={handleInputChange(index, 'pincode')}
                    error={errors[index]?.pincode && errors[index].pincode}
                  />
                  <Input
                    placeholder="Phone Number"
                    className="flex-grow"
                    label="Phone Number"
                    value={warehouse.phone}
                    onChange={handleInputChange(index, 'phone')}
                    error={errors[index]?.phone && errors[index].phone}
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
              className="col-span-full ml-auto w-auto"
            >
              <PiPlusBold className="me-2 h-4 w-4" /> Add Address
            </Button>
            <Button
              onClick={() => {
                setStep(7);
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
              isLoading={isLoading}
              className=" mt-5"
              type="submit"
              color="primary"
            >
              Submit
              <FiChevronsRight className="ml-3 h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepEight;
