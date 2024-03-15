'use client';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Button } from '@/component/ui/button';
import WelcomeBanner from '@/component/banners/welcome';
import StatCards from './stat-cards';
import TotalStats from './total-stats';
import RevenueStats from './revenue-stats';
import OrderStats from './order-stats1';
import welcomeImg from '@public/shop-illustration.png';
import HandWaveIcon from '@/component/icons/hand-wave';
import { useContext } from 'react';
import { UserContext } from '@/store/user/context';
import { formatNumber } from '@/utils/format-number';
import useSWR from 'swr';
import { BaseApi, admintotalCount } from '@/constants';
import axios from 'axios';
import { BsActivity } from 'react-icons/bs';

export default function EcommerceDashboard() {
  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const morningEnd = 12;
    const afternoonEnd = 17;
    const eveningEnd = 19;
    if (hours < morningEnd) {
      return 'Good Morning';
    } else if (hours < afternoonEnd) {
      return 'Good Afternoon';
    } else if (hours < eveningEnd) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  const { state } = useContext(UserContext);
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let {
    data: data1,
    isLoading,
    error,
  } = useSWR(`${BaseApi}${admintotalCount}`, fetcher, {
    refreshInterval: 3600000,
    revalidateOnFocus: true,
    errorRetryCount: 3,
  });
  const totalSales = data1?.data?.totalSales;
  const orders = data1?.data?.orders;
  const products = data1?.data?.products;
  const coupons = data1?.data?.coupons;
  const tickets = data1?.data?.tickets;
  const platformRevenue = data1?.data?.platformRevenue;

  const data = [
    {
      name: 'Total Sales',
      value: `₹${totalSales && formatNumber(totalSales)}`,
      percentage: 75,
      color: '#3872FA',
    },
    {
      name: 'Platform Revenue',
      value: `₹${platformRevenue && formatNumber(platformRevenue)}`,
      percentage: 50,
      color: '#f1416c',
    },
    {
      name: 'Total Orders',
      value: `${orders && formatNumber(orders)}`,
      percentage: 60,
      color: '#10b981',
    },
    {
      name: 'Total Products',
      value: `${products && formatNumber(products)}`,
      percentage: 50,
      color: '#f1416c',
    },

    {
      name: 'Total Coupons',
      value: `${coupons && formatNumber(coupons)}`,
      percentage: 60,
      color: '#10b981',
    },
    {
      name: 'Total Tickets',
      value: `${tickets && formatNumber(tickets)}`,
      percentage: 75,
      color: '#3872FA',
    },
  ];

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
        <WelcomeBanner
          title={
            <>
              {getGreeting()}, <br />{' '}
              {state?.user != null && state?.user?.name + ' '}
              <HandWaveIcon className="inline-flex h-8 w-8" />
            </>
          }
          description={
            'Here’s What happening on your store today. See the statistics at once.'
          }
          media={
            <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
              <div className="relative">
                <Image
                  src={welcomeImg}
                  alt="Welcome shop image form freepik"
                  className="dark:brightness-95 dark:drop-shadow-md"
                />
              </div>
            </div>
          }
          contentClassName="@2xl:max-w-[calc(100%-340px)]"
          className="border border-gray-200 bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 lg:pb-9 dark:bg-gray-100/30"
        >
          <Link href={'/sellers'} className="inline-flex">
            <Button
              tag="span"
              className="h-[38px] shadow md:h-10 dark:bg-gray-100 dark:text-gray-900"
            >
              <BsActivity className="me-1 h-4 w-4" /> View Sellers
            </Button>
          </Link>
        </WelcomeBanner>
        {/* stats */}

        <StatCards className="@2xl:grid-cols-3 @3xl:gap-6 @4xl:col-span-2 @7xl:col-span-8" />

        {/* total things */}

        <TotalStats
          data={data?.slice(0, 3)}
          isLoading={isLoading}
          error={error}
          heading="Total Numbers"
          footer="Revenue Orders and Products"
          className="h-[300px] @sm:h-[360px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-[300px]"
        />

        <TotalStats
          data={data?.slice(3, 6)}
          isLoading={isLoading}
          error={error}
          heading="Total Numbers"
          footer="Categories Coupons and Tickets"
          className="h-[300px] @sm:h-[360px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-[300px]"
        />

        {/* month wise revenue stats */}
        <OrderStats className="@4xl:col-span-2 @7xl:col-span-8" />
        <RevenueStats className="@4xl:col-span-2 @7xl:col-span-8" />

        {/* month/days order stats */}
        {/* <OrderStats className="@4xl:col-start-2 @4xl:row-start-3 @7xl:col-span-4 @7xl:col-start-auto @7xl:row-start-auto" /> */}
      </div>
    </div>
  );
}
