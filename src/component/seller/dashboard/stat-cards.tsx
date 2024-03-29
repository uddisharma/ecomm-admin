'use client';

import MetricCard from '@/component/cards/metric-card';
import { Text } from '@/component/ui/text';
import { BaseApi, datewiseStatsSeller, errorRetry } from '@/constants';
import { fetcher } from '@/constants/fetcher';
import cn from '@/utils/class-names';
import { formatNumber } from '@/utils/format-number';
import { extractPathAndParams } from '@/utils/urlextractor';
import { useParams } from 'next/navigation';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import {
  PiGiftDuotone,
  PiBankDuotone,
  PiChartPieSliceDuotone,
} from 'react-icons/pi';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import useSWR from 'swr';

const orderData = [
  {
    day: 'Sunday',
    sale: 4000,
    cost: 2400,
  },
  {
    day: 'Monday',
    sale: 3000,
    cost: 1398,
  },
  {
    day: 'Tuesday',
    sale: 2000,
    cost: 9800,
  },
  {
    day: 'Wednesday',
    sale: 2780,
    cost: 3908,
  },
  {
    day: 'Thursday',
    sale: 1890,
    cost: 4800,
  },
  {
    day: 'Friday',
    sale: 2390,
    cost: 3800,
  },
  {
    day: 'Saturday',
    sale: 3490,
    cost: 4300,
  },
];

const salesData = [
  {
    day: 'Sunday',
    sale: 2000,
    cost: 2400,
  },
  {
    day: 'Monday',
    sale: 3000,
    cost: 1398,
  },
  {
    day: 'Tuesday',
    sale: 2000,
    cost: 9800,
  },
  {
    day: 'Wednesday',
    sale: 2780,
    cost: 3908,
  },
  {
    day: 'Thursday',
    sale: 1890,
    cost: 4800,
  },
  {
    day: 'Friday',
    sale: 2390,
    cost: 3800,
  },
  {
    day: 'Saturday',
    sale: 3490,
    cost: 4300,
  },
];

const revenueData = [
  {
    day: 'Sunday',
    sale: 2000,
    cost: 2400,
  },
  {
    day: 'Monday',
    sale: 2800,
    cost: 1398,
  },
  {
    day: 'Tuesday',
    sale: 3500,
    cost: 9800,
  },
  {
    day: 'Wednesday',
    sale: 2780,
    cost: 3908,
  },
  {
    day: 'Thursday',
    sale: 1890,
    cost: 4800,
  },
  {
    day: 'Friday',
    sale: 2390,
    cost: 3800,
  },
  {
    day: 'Saturday',
    sale: 3490,
    cost: 4300,
  },
];

export default function StatCards({ className }: { className?: string }) {
  const params = useParams();

  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  });

  const formattedTime: any = formatter.format(now);

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error } = useSWR(
    `${BaseApi}${datewiseStatsSeller}/${params?.seller}?date=${formattedTime?.slice(
      0,
      10
    )}`,
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

  const eComDashboardStatData = [
    {
      id: '1',
      icon: <PiGiftDuotone className="h-6 w-6" />,
      title: 'Todays Orders',
      metric: data?.data?.orders,
      increased: true,
      decreased: false,
      percentage: '+32.40',
      style: 'text-[#3872FA]',
      fill: '#3872FA',
      chart: orderData,
      desc: "Today's Orders",
    },
    {
      id: '2',
      icon: <PiChartPieSliceDuotone className="h-6 w-6" />,
      title: 'Sales',
      metric: `₹${data?.data ? formatNumber(data?.data?.sales) : ''}`,
      increased: false,
      decreased: true,
      percentage: '-4.40',
      style: 'text-[#10b981]',
      fill: '#10b981',
      chart: salesData,
      desc: `Sale of day  ₹${data ? data?.data?.sales : ''}`,
    },
    {
      id: '3',
      icon: <PiBankDuotone className="h-6 w-6" />,
      title: 'Revenue',
      metric: `₹${data?.data && formatNumber(data?.data?.revenue)}`,
      increased: true,
      decreased: false,
      percentage: '+32.40',
      style: 'text-[#7928ca]',
      fill: '#7928ca',
      chart: revenueData,
      desc: `Revenue of day ₹${
        data?.data ? data?.data?.revenue : ''
      } and Platform fee ₹${data ? data?.data?.charge : ''}`,
    },
  ];

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
    <div
      className={cn('grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9', className)}
    >
      {eComDashboardStatData.map((stat) => (
        <MetricCard
          key={stat.title + stat.id}
          title={stat.title}
          metric={stat.metric}
          isLoading={isLoading}
          error={error}
          metricClassName="lg:text-[22px]"
          icon={stat.icon}
          iconClassName={cn(
            '[&>svg]:w-10 [&>svg]:h-8 lg:[&>svg]:w-11 lg:[&>svg]:h-9 w-auto h-auto p-0 bg-transparent -mx-1.5',
            stat.id === '1' &&
              '[&>svg]:w-9 [&>svg]:h-7 lg:[&>svg]:w-[42px] lg:[&>svg]:h-[34px]',
            stat.style
          )}
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <BarChart barSize={5} barGap={2} data={stat.chart}>
                <Bar dataKey="sale" fill={stat.fill} radius={5} />
              </BarChart>
            </ResponsiveContainer>
          }
          chartClassName="hidden @[200px]:flex @[200px]:items-center h-14 w-24"
          className="@container [&>div]:items-center"
        >
          <Text className="mt-5 flex items-center border-t border-dashed border-gray-200 pt-4 leading-none text-gray-500">
            {/* <Text
              as="span"
              className={cn(
                'me-2 inline-flex items-center font-medium',
                stat.increased ? 'text-green' : 'text-red'
              )}
            >
              {stat.increased ? (
                <PiCaretDoubleUpDuotone className="me-1 h-4 w-4" />
              ) : (
                <PiCaretDoubleDownDuotone className="me-1 h-4 w-4" />
              )}
              {stat.percentage}%
            </Text>
            <Text as="span" className="me-1 hidden @[240px]:inline-flex">
              {stat.increased ? 'Increased' : 'Decreased'}
            </Text>{' '} */}
            {stat?.desc}
          </Text>
        </MetricCard>
      ))}
    </div>
  );
}
