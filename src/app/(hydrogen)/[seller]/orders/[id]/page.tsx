'use client';
import { Button } from '@/component/ui/button';
import PageHeader from '@/component/others/pageHeader';
import { CartProvider } from '@/store/quick-cart/cart.context';
import { PiDownloadSimpleBold } from 'react-icons/pi';
import { FaTruck } from 'react-icons/fa';
import OrderView from '@/component/ecommerce/order/order-view';
import { BaseApi, errorRetry, singleOrder, updateOrders } from '@/constants';
import useSWR from 'swr';
import axios from 'axios';
import OrderDetailsLoadingPage from '@/component/loading/orderdetails';
import { toast } from 'sonner';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import { useState } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { fetcher } from '@/constants/fetcher';
import { extractPathAndParams } from '@/utils/urlextractor';

export default function OrderDetailsPage({ params }: any) {
  const [cookies] = useCookies(['admintoken']);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${singleOrder}/${params?.id}`,
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

  const orderData = data;
  const [loading, setLoading] = useState(false);
  const updateStatus = async (id: any, status: any) => {
    try {
      setLoading(true);
      await axios.patch(
        `${BaseApi}${updateOrders}/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      );
      await mutate();
      return toast.success(`Order Marked as ${status}`);
    } catch (error: any) {
      if (error?.response?.data?.status == 'UNAUTHORIZED') {
        localStorage.removeItem('admin');
        const currentUrl = window.location.href;
        const path = extractPathAndParams(currentUrl);
        if (typeof window !== 'undefined') {
          location.href = `/auth/sign-in?ref=${path}`;
        }
        return toast.error('Session Expired');
      }
      console.log(error);
      return toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const pageHeader = {
    title: `Order #${
      data == null
        ? ''
        : orderData?.order
        ? String(orderData?.order?.order_id)
        : String(orderData?.order_id)
    }`,
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/${params?.seller}/dashboard`,
        name: 'Seller',
      },
      {
        name:
          data == null
            ? ''
            : orderData?.order
            ? `order #${String(orderData?.order?.order_id)}`
            : `order #${String(orderData?.order_id)}`,
      },
    ],
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

  return (
    <>
      <CartProvider>
    
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          <div className="mt-6 flex items-center gap-4 @2xl:mt-0">
            {orderData?.courior != 'Local' && (
              <Link
                href={`/track/${orderData?.id}/${orderData?.order?.awb_number}`}
              >
                <Button className="w-full gap-2 @lg:w-auto" variant="outline">
                  <FaTruck className="h-4 w-4" />
                  Track
                </Button>
              </Link>
            )}
            {orderData?.courior == 'Local' ? (
              <Link target="blank" href={`/label/${orderData.id}`}>
                <Button className="w-full gap-2 @lg:w-auto" variant="outline">
                  <PiDownloadSimpleBold className="h-4 w-4" />
                  Label
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  window.open(orderData?.order?.label, '_blank');
                }}
                className="w-full gap-2 @lg:w-auto"
                variant="outline"
              >
                <PiDownloadSimpleBold className="h-4 w-4" />
                label
              </Button>
            )}
            {orderData?.courior == 'Local' ? (
              <Link target="blank" href={`/bill/${orderData.id}`}>
                <Button className="w-full gap-2 @lg:w-auto" variant="outline">
                  <PiDownloadSimpleBold className="h-4 w-4" />
                  Bill
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  window.open(orderData?.order?.label, '_blank');
                }}
                className="w-full gap-2 @lg:w-auto"
                variant="outline"
              >
                <PiDownloadSimpleBold className="h-4 w-4" />
                Bill
              </Button>
            )}
          </div>
        </PageHeader>
        {isLoading ? (
          <OrderDetailsLoadingPage />
        ) : error ? (
          <div style={{ paddingBottom: '100px' }}>
            <Empty
              image={<SearchNotFoundIcon />}
              text="Something Went Wrong !"
              className="h-full justify-center"
            />
          </div>
        ) : data == null ? (
          <div style={{ paddingBottom: '100px' }}>
            <Empty
              image={<SearchNotFoundIcon />}
              text="No Data found !"
              className="h-full justify-center"
            />
          </div>
        ) : (
          orderData &&
          orderData?.status && (
            <OrderView
              orderData={orderData}
              updateStatus={updateStatus}
              loading={loading}
            />
          )
        )}
      </CartProvider>
    </>
  );
}
