'use client';
import { useModal } from '@/component/modal-views/use-modal';
import cn from '@/utils/class-names';
import { Input } from '@/component/ui/input';
import { Form } from '@/component/ui/form';
import {
  PiArrowLineUpRightBold,
  PiArrowRightBold,
  PiXBold,
} from 'react-icons/pi';
import {
  ActionIcon,
  Button,
  Checkbox,
  Empty,
  SearchNotFoundIcon,
  Text,
  Title,
} from 'rizzui';
import {
  Swiper,
  SwiperSlide,
  Pagination,
} from '@/component/ui/carousel/carousel';
import NextBtn from '@/component/ui/carousel/next-btn';
import PrevBtn from '@/component/ui/carousel/prev-btn';
import PageHeader from '@/component/others/pageHeader';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { BaseApi, singleSeller, updateSeller } from '@/constants';
import axios from 'axios';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/component/ui/skeleton';
import Image from 'next/image';

const schema = z.object({
  name: z.string().min(1),
  rate: z.string().min(1),
  have: z?.boolean(),
});

type Schema = z.infer<typeof schema>;

function PromoBanner() {
  const { openModal } = useModal();
  const pageHeader = {
    title: 'Logistics',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        name: 'Logistics',
      },
    ],
  };

  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  const params = useParams();
  let {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(`${BaseApi}${singleSeller}/${params?.seller}`, fetcher, {
    refreshInterval: 3600000,
  });

  const seller = data?.data?.user;

  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      {loading ? (
        <div style={{ height: '100vh' }}>
          <Skeleton style={{ height: '200px' }} className="h-30 w-full" />
          <Skeleton
            style={{ height: '200px', marginTop: '10px' }}
            className="h-30 w-full"
          />
        </div>
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : data ? (
        <>
          {seller?.deliverypartner?.personal?.name && (
            <div
              className={cn(
                'relative mt-2 flex flex-col items-center overflow-hidden rounded-xl border border-gray-300 xs:flex-row'
              )}
            >
              <div className="relative h-full min-h-[200px] w-full sm:max-w-[223px]">
                <Image
                  className=" rounded-t-xl object-cover xs:rounded-none xs:rounded-s-xl"
                  src="/logistics/truck.png"
                  style={{
                    display: 'block',
                    margin: 'auto',
                    marginTop: '40px',
                    scale: '0.7',
                  }}
                  height={1000}
                  width={1000}
                  alt=""
                />
              </div>
              <div className="flex w-full flex-col justify-between p-5 pb-6 sm:p-6">
                <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
                  {seller?.deliverypartner?.personal?.name}
                  {seller?.deliverypartner?.personal.have ? (
                    <Text
                      as="span"
                      className="relative ml-3 mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green"
                    >
                      Active Now
                    </Text>
                  ) : (
                    <Text
                      as="span"
                      className="relative ml-3 mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-red"
                    >
                      InActive Now
                    </Text>
                  )}
                </h5>
                <p className="mb-2 text-sm font-normal text-gray-500">
                  Your Local Delivery Partner{' '}
                </p>
                <p className="mb-5 text-sm font-normal text-gray-500">
                  Rate : ₹{seller?.deliverypartner?.personal?.rate}
                </p>

                <div className="mt-4 flex flex-col items-center gap-3 @lg:mt-0 lg:flex-row">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto lg:w-auto dark:bg-gray-100 dark:text-white"
                    onClick={() =>
                      openModal({
                        view: <WareHouse1 data={seller} />,
                        customSize: '500px',
                      })
                    }
                  >
                    View Warehouse
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-3 w-full sm:w-auto lg:mt-0 lg:w-auto dark:bg-gray-100 dark:text-white"
                    onClick={() =>
                      openModal({
                        view: (
                          <EditLogistics
                            data={seller?.deliverypartner?.personal}
                            mutate={mutate}
                            data1={seller}
                          />
                        ),
                        customSize: '400px',
                      })
                    }
                  >
                    Edit Service
                  </Button>
                </div>
              </div>
            </div>
          )}
          {seller?.deliverypartner?.partner?.email && (
            <div
              className={cn(
                'relative mb-20 mt-10 flex flex-col items-center overflow-hidden rounded-xl border border-gray-300 xs:flex-row'
              )}
            >
              <div className="relative h-full min-h-[200px] w-full sm:max-w-[223px]">
                <Image
                  className=" rounded-t-xl object-cover xs:rounded-none xs:rounded-s-xl"
                  src="/logistics/nimbus.jpeg"
                  width={1000}
                  height={1000}
                  style={{ display: 'block', margin: 'auto', scale: '0.8' }}
                  //   style={{ width: '100%', height: '200px' }}
                  alt=""
                />
              </div>

              <div className="flex flex-col justify-between p-5 pb-6 sm:p-6">
                <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
                  Nimbus Post Pvt Ltd{' '}
                  <Text
                    as="span"
                    className="relative ml-3 mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green"
                  >
                    Active Now
                  </Text>
                </h5>
                <p className="mb-5 text-sm font-normal text-gray-500">
                  An Advance Tech Embeded Delivery Platform
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto dark:bg-gray-100 dark:text-white"
                    onClick={() =>
                      openModal({
                        view: (
                          <WareHouses
                            data={seller?.deliverypartner?.partner?.warehouses}
                            data1={seller}
                            mutate={mutate}
                          />
                        ),
                        customSize: '500px',
                      })
                    }
                  >
                    View Warehouse
                  </Button>
                </div>
              </div>
              <div>
                <a
                  href="https://ship.nimbuspost.com"
                  target="_blank"
                  rel="noopener noreferrer nofollow noindex"
                  className="absolute right-5 top-5 inline-flex rounded-md border border-gray-200 p-2"
                >
                  <PiArrowLineUpRightBold />
                </a>
              </div>
            </div>
          )}
          {!seller?.deliverypartner?.partner?.email &&
            !seller?.deliverypartner?.personal?.have && (
              <div style={{ paddingBottom: '100px' }}>
                <Empty
                  image={<SearchNotFoundIcon />}
                  text="Logistics Service Not Found !"
                  className="h-full justify-center"
                />
              </div>
            )}
        </>
      ) : (
        ''
      )}
    </>
  );
}
export default PromoBanner;

const WareHouses = ({ data, data1, mutate }: any) => {
  data = data.sort((a: any, b: any) => b.default - a.default);
  const [warehouses, setWarehouses] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  useEffect(() => {
    setWarehouses(data);
  }, []);

  const handleSetDefault = async (selectedWarehouse: any) => {
    let updatedWarehouses = warehouses.map((warehouse: any) => ({
      ...warehouse,
      default: warehouse.warehouse_name === selectedWarehouse.warehouse_name,
    }));

    try {
      setLoading(true);
      const res = await axios.patch(
        `${BaseApi}${updateSeller}/${params?.seller}`,
        {
          deliverypartner: {
            personal: data1?.deliverypartner?.personal,
            partner: {
              email: data1?.deliverypartner?.partner?.email,
              password: data1?.deliverypartner?.partner?.password,
              warehouses: updatedWarehouses,
            },
          },
        }
      );
      if (res.data?.status == 'SUCCESS') {
        updatedWarehouses = updatedWarehouses.sort(
          (a: any, b: any) => b.default - a.default
        );
        setWarehouses(updatedWarehouses);
        await mutate();
        return toast.success('Warehouse successfully updated!');
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error) {
      return toast.error('Something went wrong !');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Swiper
        speed={500}
        spaceBetween={0}
        slidesPerView={1}
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        className="profileModalCarousel h-full min-h-[420px]"
      >
        {warehouses?.map((e: any, i: any) => (
          <SwiperSlide
            key={e}
            style={{ marginTop: '60px' }}
            className={cn('rounded-lg border border-gray-300 p-5 @3xl:p-7 ')}
          >
            <div
              style={{
                marginTop: '60px',
                marginBottom: '100px',
                paddingLeft: '50px',
              }}
            >
              <Title as="h3" className="text-base font-semibold sm:text-lg">
                {e.warehouse_name}
                <span style={{ color: 'green', fontSize: '12px' }}>
                  {e?.default && (
                    <Text
                      as="span"
                      className="relative ml-3 mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green"
                    >
                      Default
                    </Text>
                  )}
                </span>
              </Title>
              <ul className="mt-4 grid gap-3 @3xl:mt-5">
                <li className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">Name :</span>
                  <span>{e.name}</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">Phone :</span>
                  <span>{e?.phone}</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">Address :</span>
                  <span>{e.address}</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    Address 2 :
                  </span>
                  <span>{e?.address_2}</span>
                </li>

                <li className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">City :</span>
                  <span>
                    {e?.city} ({e?.pincode}){' '}
                  </span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">State :</span>
                  <span>{e?.state}</span>
                </li>
              </ul>

              <Button
                isLoading={loading}
                onClick={() => {
                  handleSetDefault(e);
                }}
                style={{
                  marginTop: '20px',
                  visibility: e?.default ? 'hidden' : 'inherit',
                }}
                variant="outline"
                className=""
              >
                Make Default
              </Button>
              <p
                style={{
                  marginTop: '5px',
                  visibility: e?.default ? 'hidden' : 'inherit',
                }}
                className="text-sm font-semibold text-red-dark"
              >
                Your Orders will Pickup <br /> from this Address
              </p>
            </div>
          </SwiperSlide>
        ))}
        <NextBtn />
        <PrevBtn />
      </Swiper>
    </div>
  );
};

const WareHouse1 = ({ data }: any) => {
  return (
    <div>
      <div
        style={{ marginTop: '60px' }}
        className={cn('rounded-lg border border-gray-300 p-5 @3xl:p-7 ')}
      >
        <div
          style={{
            marginTop: '60px',
            marginBottom: '100px',
            paddingLeft: '50px',
          }}
        >
          <Title as="h3" className="text-base font-semibold sm:text-lg">
            Warehouse 1
            <Text
              as="span"
              className="relative ml-3 mt-2 inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green"
            >
              Default
            </Text>
          </Title>
          <ul className="mt-4 grid gap-3 @3xl:mt-5">
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">Name :</span>
              <span>{data?.shopname}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">Phone :</span>
              <span>{data?.mobileNo}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">Address :</span>
              <span>{data?.shopaddress?.address1}</span>
            </li>
            {data?.address2 && (
              <li className="flex items-center gap-1">
                <span className="font-semibold text-gray-900">Address 2 :</span>
                <span>{data?.shopaddress?.address2}</span>
              </li>
            )}
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">Landmark :</span>
              <span>{data?.shopaddress?.landmark}</span>
            </li>

            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">City :</span>
              <span>{data?.shopaddress?.city}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">State :</span>
              <span>{data?.shopaddress?.state}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

function EditLogistics({ data, mutate, data1 }: any) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const initialValues: Schema = {
    name: data?.name ?? '',
    rate: data?.rate ?? '',
    have: data?.have ?? false,
  };
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${BaseApi}${updateSeller}/${params?.seller}`,
        {
          deliverypartner: {
            personal: data,
            partner: data1?.deliverypartner?.partner,
          },
        }
      );
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        closeModal();
        return toast.success('Warehouse successfully updated!');
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error) {
      return toast.error('Something went wrong !');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
      <div className="mb-7 flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Edit Your Logistics Service
        </Title>
        <ActionIcon size="sm" variant="text" onClick={() => closeModal()}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <Form<Schema>
        validationSchema={schema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="text"
              size="lg"
              label="Logistics Service Name"
              placeholder="Name"
              color="info"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              type="number"
              size="lg"
              label="Logistics Service Rate"
              placeholder="Rate"
              color="info"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('rate')}
              error={errors.rate?.message}
            />

            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('have')}
                label="Currently working with you (Show this service to customers ?)"
                color="info"
                variant="flat"
                className="[&>label>span]:font-medium"
              />
            </div>
            <Button
              isLoading={loading}
              className="w-full"
              type="submit"
              size="lg"
            >
              <span>Save Changes</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-6 w-6" />
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
