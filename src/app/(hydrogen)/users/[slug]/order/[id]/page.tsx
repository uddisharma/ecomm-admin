'use client';
import { PiDownloadSimpleBold } from 'react-icons/pi';
import { Button } from '@/component/ui/button';
import PageHeader from '@/component/others/pageHeader';
import Addresses from '@/component/Order/address';
import InvoiceDetails from '@/component/Order/invoicedetails';
import ShippingDetails from '@/component/Order/shippingdetails';
import useSWR from 'swr';
import { BaseApi, errorRetry, orderDetails } from '@/constants';
import { useParams, useRouter } from 'next/navigation';
import BannerLoading from '@/component/loading/bannerLoading';
import { FaTruck } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import { fetcher } from '@/constants/fetcher';
import { extractPathAndParams } from '@/utils/urlextractor';

export default function LogisticsListPage() {
  const router = useParams();
  const router1 = useRouter();

  const pageHeader = {
    title: 'Order Details',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/users',
        name: 'Users',
      },
      {
        href: `/${router?.slug}/orders`,
        name: 'Orders',
      },
      {
        name: 'Order Details',
      },
    ],
  };

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error } = useSWR(
    `${BaseApi}${orderDetails}/${router?.id}`,
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
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-6 flex items-center gap-4 @2xl:mt-0">
          {data?.courior == 'Local' ? (
            <Button className="w-full gap-2 @lg:w-auto" variant="outline">
              <FaTruck className="h-4 w-4" />
              Tracking N/A
            </Button>
          ) : (
            <Button
              onClick={() => {
                {
                  data?.courior == 'Local'
                    ? toast.error('Tracking Not Available for this order')
                    : router1.push(
                        `/track/${router?.slug}/${data?.order?.awb_number}`
                      );
                }
              }}
              className="w-full gap-2 @lg:w-auto"
              variant="outline"
            >
              <FaTruck className="h-4 w-4" />
              Track
            </Button>
          )}
          <div
            onClick={() => {
              window.open(data?.order?.label, '_blank');
            }}
            className="w-full gap-2 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            style={{ borderRadius: '5px' }}
          >
            <Button className="w-full gap-2 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100">
              <PiDownloadSimpleBold className="h-4 w-4" />
              Invoice
            </Button>
          </div>
        </div>
      </PageHeader>
      {isLoading ? (
        [1, 2, 3]?.map((e) => (
          <div key={e} style={{ marginTop: '10px' }}>
            <BannerLoading />
          </div>
        ))
      ) : (
        <div className="mt-2 flex flex-col gap-y-6 @container sm:gap-y-10">
          <InvoiceDetails order={data} />
          <ShippingDetails order={data} />
          <Addresses order={data} />
        </div>
      )}
    </>
  );
}
