// 'use client';

import Image from 'next/image';

import OrderViewProducts from './order-products/order-view-products';
import { Title, Text } from '@/component/ui/text';
import { formatDate } from '@/utils/format-date';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import cn from '@/utils/class-names';
import { Avatar, Button } from 'rizzui';
import useMedia from 'react-use/lib/useMedia';
import { useContext } from 'react';
import { UserContext } from '@/store/user/context';

const calculateTotalQuantity = (orderItems: any) => {
  let totalQuantity = 0;
  for (const item of orderItems) {
    totalQuantity += item.quantity;
  }
  return totalQuantity;
};
const calculateSubtotal = (orderItems: any) => {
  let total = 0;
  for (const item of orderItems) {
    total += Number(item.amount);
  }
  return total;
};

const findAddressById = (addresses: any, addressId: any) => {
  const foundAddress = addresses.find(
    (address: any) => address.id === addressId
  );

  if (foundAddress) {
    return foundAddress;
  } else {
    return null;
  }
};

function WidgetCard({
  title,
  className,
  children,
  childrenWrapperClass,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
  childrenWrapperClass?: string;
}) {
  return (
    <div className={className}>
      <Title
        as="h3"
        className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg"
      >
        {title}
      </Title>
      <div
        className={cn(
          'rounded-lg border border-gray-200 px-5 @sm:px-7 @5xl:rounded-xl',
          childrenWrapperClass
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function OrderView({ orderData, updateStatus, loading }: any) {
  const address = findAddressById(
    orderData?.customerId && orderData?.customerId?.shippingAddress,
    orderData?.addressId
  );
  const isWideScreen = useMedia('(min-width: 768px)');

  const isMobile = useMedia('(max-width: 767px)', true);

  const { state } = useContext(UserContext);

  return (
    <div className="@container">
      <div className="flex flex-wrap justify-center border-b border-t border-gray-300 py-4 font-medium text-gray-700 @5xl:justify-start">
        <span className="my-2 border-r border-gray-200 px-5 py-0.5 first:ps-0 last:border-r-0">
          {formatDate(new Date(orderData?.createdAt), 'MMMM D, YYYY')} at{' '}
          {formatDate(new Date(orderData?.createdAt), 'h:mm A')}
        </span>
        <span className="my-2 border-r border-gray-200 px-5 py-0.5 first:ps-0 last:border-r-0">
          {orderData?.orderItems &&
            calculateTotalQuantity(orderData?.orderItems)}{' '}
          Items
        </span>
        <span className="my-2 border-r border-gray-200 px-5 py-0.5 first:ps-0 last:border-r-0">
          Total ₹{orderData?.totalAmount}
        </span>
        {orderData?.payment ? (
          <span className="my-2 ms-5 rounded-3xl border-r border-gray-200 bg-green-lighter px-2.5 py-1 text-xs text-green-dark first:ps-0 last:border-r-0">
            Paid
          </span>
        ) : (
          <span className="my-2 ms-5 rounded-3xl border-r border-gray-200 bg-red-lighter px-2.5 py-1 text-xs text-red-dark first:ps-0 last:border-r-0">
            Unpaid
          </span>
        )}

        <span className="my-2 border-r border-gray-200 px-3 py-0.5 first:ps-0 last:border-r-0"></span>
        {orderData?.status == 'Received' ? (
          <span className="my-2 ms-5 rounded-3xl border-r border-gray-200 bg-green-lighter px-2.5 py-1 text-xs text-green-dark first:ps-0 last:border-r-0">
            {orderData?.status}
          </span>
        ) : (
          <span className="my-2 ms-5 rounded-3xl border-r border-gray-200  bg-orange-lighter px-2.5 py-1 text-xs text-orange-dark first:ps-0 last:border-r-0">
            {orderData?.status}
          </span>
        )}
        <span className="my-2 border-r border-gray-200 px-3 py-0.5 first:ps-0 last:border-r-0"></span>
        {isWideScreen && (
          <div>
            {orderData?.status == 'Received' ? (
              <Button
                onClick={() => {
                  updateStatus(orderData?.id, 'Dispatched');
                }}
                isLoading={loading}
                className=" w-full gap-2 @lg:w-auto"
                variant="outline"
              >
                <IoCheckmarkDoneSharp className="h-4 w-4" />
                Mark as Dispatched
              </Button>
            ) : (
              <Button
                onClick={() => {
                  updateStatus(orderData?.id, 'Received');
                }}
                isLoading={loading}
                className=" w-full gap-2 @lg:w-auto"
                variant="outline"
              >
                <IoCheckmarkDoneSharp className="h-4 w-4" />
                Mark as Pending
              </Button>
            )}
          </div>
        )}
      </div>
      {isMobile && (
        <div className="border-b border-t border-gray-300 py-4 font-medium text-gray-700 @5xl:justify-start">
          <div>
            {orderData?.status == 'Received' ? (
              <Button
                style={{ width: '100%' }}
                className="w-full gap-2 @lg:w-auto"
                variant="outline"
                onClick={() => {
                  updateStatus(orderData?.id, 'Dispatched');
                }}
                isLoading={loading}
              >
                <IoCheckmarkDoneSharp className="h-4 w-4" />
                Mark as Dispatched
              </Button>
            ) : (
              <Button
                style={{ width: '100%' }}
                className=" w-full gap-2 @lg:w-auto"
                variant="outline"
                onClick={() => {
                  updateStatus(orderData?.id, 'Received');
                }}
                isLoading={loading}
              >
                <IoCheckmarkDoneSharp className="h-4 w-4" />
                Mark as Pending
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="items-start pt-10 @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7">
          {orderData?.note && (
            <div className="mt-3">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Notes About Order
              </span>
              <div className="rounded-xl border border-gray-200 px-5 py-3 text-sm leading-[1.85]">
                {orderData?.note}
              </div>
            </div>
          )}
          <div className="pb-5">
            <OrderViewProducts products={orderData?.orderItems} />
            <div className="border-t border-gray-200 pt-7 @5xl:mt-3">
              <div className="ms-auto max-w-lg space-y-6">
                <div className="flex justify-between font-medium">
                  Subtotal{' '}
                  <span>+ ₹{calculateSubtotal(orderData?.orderItems)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  Shipping <span>+ ₹{orderData?.shipping}</span>
                </div>
                <div className="flex justify-between font-medium">
                  Discount <span>- ₹{orderData?.discount}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-5 text-base font-semibold">
                  Total <span>₹{orderData?.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-7 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
          <WidgetCard
            title="Customer Details"
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="relative aspect-square h-16 w-16 shrink-0 @5xl:h-20 @5xl:w-20">
              <Avatar
                name={address?.name}
                src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp"
              />
              {/* <Image
                fill
                style={{ borderRadius: '50%' }}
                alt="avatar"
                className="object-cover"
                sizes="(max-width: 768px) 100vw"
                src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp"
              /> */}
            </div>
            <div style={{ marginLeft: '-10px' }} className="ps-2 @5xl:ps-4">
              <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg"
              >
                {address?.name}
              </Title>
              <Text
                as="p"
                className=" mb-2 break-all  font-semibold text-black last:mb-0 dark:text-white"
              >
                {address?.email}
              </Text>
              <Text
                as="p"
                className="mb-2  font-semibold text-black last:mb-0 dark:text-white"
              >
                {`${address?.phone}  ,  ${address?.phone1 && address?.phone1}`}
              </Text>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Shipping Address"
            childrenWrapperClass="@5xl:py-6 py-5"
          >
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              Address :{' '}
              <span className="font-semibold text-black dark:text-white">
                {address?.address}
              </span>
            </Text>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              Landmark :{' '}
              <span className="font-semibold text-black dark:text-white">
                {address?.landmark}
              </span>
            </Text>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              City :{' '}
              <span className="font-semibold text-black dark:text-white">
                {address?.city}
              </span>
            </Text>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              District :{' '}
              <span className="font-semibold text-black dark:text-white">
                {address?.district}
              </span>
            </Text>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              Zipcode :{' '}
              <span className="font-semibold text-black dark:text-white">
                {address?.pincode}
              </span>
            </Text>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              State :{' '}
              <span className="font-semibold text-black dark:text-white">
                {address?.state}
              </span>
            </Text>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              State :{' '}
              <span className="font-semibold text-black dark:text-white">
                India
              </span>
            </Text>
          </WidgetCard>
          <WidgetCard
            title="Courier Service"
            childrenWrapperClass="@5xl:py-6 py-5"
          >
            {orderData?.courior != 'Local' ? (
              <>
                <Text as="p" className="mb-2 leading-loose last:mb-0">
                  Courier Name :{' '}
                  <span className="font-semibold text-black dark:text-white">
                    {orderData?.order?.courier_name}
                  </span>
                </Text>
                <Text as="p" className="mb-2 leading-loose  last:mb-0">
                  Payment Type :{' '}
                  <span className="font-semibold text-black dark:text-white">
                    {orderData?.order?.payment_type == 'code'
                      ? 'Cash on Delivery'
                      : 'Prepaid'}
                  </span>
                </Text>
                <Text as="p" className="mb-2 leading-loose last:mb-0">
                  Order Id :{' '}
                  <span className="font-semibold text-black dark:text-white">
                    #{orderData?.order?.order_id}
                  </span>
                </Text>
                <Text as="p" className="mb-2 leading-loose last:mb-0">
                  Shipment Id :{' '}
                  <span className="font-semibold text-black dark:text-white">
                    #{orderData?.order?.shipment_id}
                  </span>
                </Text>
                <Text as="p" className="mb-2 leading-loose last:mb-0">
                  AWB Number :{' '}
                  <span className="font-semibold text-black dark:text-white">
                    #{orderData?.order?.awb_number}
                  </span>
                </Text>
              </>
            ) : (
              <Text as="p" className="mb-2 leading-loose last:mb-0">
                Courier Name :
                <span className="font-semibold text-black dark:text-white">
                  {` ${state?.user?.deliverypartner?.personal?.name}`}
                </span>
              </Text>
            )}
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
