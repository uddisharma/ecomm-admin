'use client';
import Image from 'next/image';
import { Title } from '@/component/ui/text';
import { Button } from '@/component/ui/button';
import { Badge } from '@/component/ui/badge';
import { PiCaretDownBold } from 'react-icons/pi';
import cn from '@/utils/class-names';
import { Collapse } from '@/component/ui/collapse';
import { useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import useSWR from 'swr';
import { BaseApi, userOrders } from '@/constants';
import { UserContext } from '@/store/user/context';
import BannerLoading from '@/component/loading/bannerLoading';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import { useParams } from 'next/navigation';

const getformatDate = (date: any) => {
  const originalDate = new Date(date);
  const formattedDate = `${originalDate.getDate()}-${
    originalDate.getMonth() + 1
  }-${originalDate.getFullYear()}`;
  return formattedDate;
};
export default function OrderCard() {
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  const { state } = useContext(UserContext);
  const params = useParams();
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(`${BaseApi}${userOrders}/${params?.slug}`, fetcher, {
    refreshInterval: 3600000,
  });

  return (
    <>
      <div className="mt-5 flex flex-col gap-7">
        {loading ? (
          [1, 2, 3, 4, 5].map((e) => (
            <div key={e} style={{ marginTop: '10px' }}>
              <BannerLoading />{' '}
            </div>
          ))
        ) : (
          <>
            {data?.length > 0 ? (
              data?.map((e: any, i: any) => (
                <div key={e.id} className="rounded-lg border border-gray-200">
                  <AccordionContent order={e} />
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-gray-200 p-5 md:flex-nowrap">
                    <span className="text-gray-500">
                      <span className="text-lg font-semibold text-gray-700 md:text-2xl">
                        ₹{e.totalAmount}
                      </span>{' '}
                      <span>Total Amount</span>
                    </span>
                    <div className="grid w-full grid-cols-2 items-center gap-4 sm:flex sm:w-auto ">
                      <Link href={`/users/${params?.slug}/order/${e?.id}`}>
                        <Button
                          size="sm"
                          style={{ cursor: 'pointer', width: '100%' }}
                          tag="span"
                          variant="text"
                          className="rounded-none border-b border-primary px-0 text-xs font-medium text-primary"
                        >
                          View Details
                        </Button>
                      </Link>

                      {e?.courior == 'Local' ? (
                        <Button
                          style={{ cursor: 'pointer', width: '100%' }}
                          size="sm"
                          className="rounded-md text-xs font-medium"
                        >
                          Tracking N/A
                        </Button>
                      ) : (
                        <Link
                          href={`/track/${params?.slug}/${e?.order?.awb_number}`}
                        >
                          <Button
                            style={{ cursor: 'pointer', width: '100%' }}
                            size="sm"
                            className="rounded-md text-xs font-medium"
                          >
                            Track Order
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Empty
                image={<SearchNotFoundIcon />}
                text="No Order Found"
                className="h-full justify-center"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

function AccordionContent({ order }: any) {
  return (
    <Collapse
      header={({ open, toggle }) => (
        <div
          onClick={toggle}
          className="flex cursor-pointer items-center justify-between gap-4 p-3 md:p-5"
        >
          <div className="flex gap-2 sm:items-center md:gap-4">
            <div className="relative aspect-square w-20">
              <Image
                src={
                  order?.orderItems &&
                  order?.orderItems[0].productId?.images &&
                  order?.orderItems[0].productId?.images
                }
                alt={order?.id}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 768px) 100vw"
                blurDataURL={`/_next/image?url=${
                  order?.orderItems &&
                  order?.orderItems[0].productId?.images &&
                  order?.orderItems[0].productId?.images
                }&w=10&q=1`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="sm:flex sm:flex-col">
              <Button
                size="sm"
                tag="span"
                variant="flat"
                color="success"
                style={{ backgroundColor: '#05361e', color: 'white' }}
                className="mb-2 h-6 rounded-md bg-secondary-lighter text-xs font-semibold text-secondary-dark sm:hidden dark:bg-secondary-dark dark:text-secondary-lighter"
              >
                {order?.sellerId?.username}
              </Button>
              <Title as="h6" className="text-gray-900">
                {order?.sellerId?.shopname}
              </Title>
              <ul className="flex items-center divide-x">
                <li className="pr-1.5"> {getformatDate(order?.createdAt)}</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              rounded="md"
              variant="flat"
              color="success"
              className={cn(
                'hidden px-3.5 py-1 sm:block',
                'dark:bg-[#05361e] dark:text-green-light'
              )}
            >
              {order?.sellerId?.username}
            </Badge>
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500',
                open && 'bg-gray-900 text-gray-0'
              )}
            >
              <PiCaretDownBold
                strokeWidth={3}
                className={cn(
                  'h-3 w-3 rotate-180 transition-transform duration-200 rtl:-rotate-180',
                  open && 'rotate-0 rtl:rotate-0'
                )}
              />
            </div>
          </div>
        </div>
      )}
    >
      {/* Body */}
      <div className="flex items-center justify-between gap-4 bg-gray-50 px-5 py-3 text-gray-500 dark:bg-gray-100">
        <span>Products that you buy from {order?.sellerId?.shopname}</span>
      </div>
      <div className="grid items-center gap-4 @container sm:grid-cols-2 lg:gap-6 xl:grid-cols-12">
        <div className="p-3 @xl:p-4 @2xl:p-5 xl:col-span-7">
          {order?.orderItems?.map((el: any, i: any) => (
            <div
              style={{
                border: '1px solid #333',
                borderRadius: '10px',
                padding: '10px',
                marginTop: '5px',
              }}
              key={i}
              className="grid grid-cols-8"
            >
              <div className="hidden flex-col gap-0.5 lg:col-span-2 lg:flex">
                <span>
                  {' '}
                  ₹{el?.productId?.price}*{el.quantity}
                </span>
              </div>

              <div className="col-span-7 flex flex-col lg:col-span-5">
                <span className="block text-xs font-semibold text-gray-900 lg:hidden lg:text-sm">
                  ₹{el?.productId?.price}*{el.quantity}
                </span>
                <span className=" font-semibold text-gray-900">
                  {el?.productId?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="relative hidden h-[228px] @2xl:block xl:col-span-5">
          <Image
            src="/map.webp"
            alt="Qatar Logo"
            fill
            priority
            quality={100}
            placeholder="blur"
            sizes="(max-width: 768px) 100vw"
            blurDataURL={`/_next/image?url="/map.webp"&w=10&q=1`}
            className="dark:opacity-[0.2]"
          />
        </div>
      </div>
    </Collapse>
  );
}
