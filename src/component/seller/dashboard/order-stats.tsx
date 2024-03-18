'use client';

import { useState } from 'react';
import WidgetCard from '@/component/cards/widget-card';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { useMedia } from '@/hooks/use-media';
import { CustomYAxisTick } from '@/component/charts/custom-yaxis-tick';
import { CustomTooltip } from '@/component/charts/custom-tooltip';
import SimpleBar from '@/component/ui/simplebar';
import cn from '@/utils/class-names';
import DropdownAction from '@/component/charts/dropdown-action';
import { formatNumber } from '@/utils/format-number';
import Spinner from '@/component/ui/spinner';

const monthlyData = [
  {
    key: 'Jan',
    revenue: 5000,
    expense: 1500,
    orders: 3200,
  },
  {
    key: 'Feb',
    revenue: 4600,
    expense: 3798,
    orders: 3700,
  },
  {
    key: 'Mar',
    revenue: 5900,
    expense: 1300,
    orders: 3000,
  },
  {
    key: 'Apr',
    revenue: 5780,
    expense: 3908,
    orders: 4000,
  },
  {
    key: 'May',
    revenue: 4890,
    expense: 2500,
    orders: 2500,
  },
  {
    key: 'Jun',
    revenue: 8000,
    expense: 3200,
    orders: 1200,
  },
  {
    key: 'Jul',
    revenue: 4890,
    expense: 2500,
    orders: 500,
  },
  {
    key: 'Aug',
    revenue: 3780,
    expense: 3908,
    orders: 1230,
  },
  {
    key: 'Sep',
    revenue: 7800,
    expense: 2800,
    orders: 3400,
  },
  {
    key: 'Oct',
    revenue: 5780,
    expense: 1908,
    orders: 2000,
  },
  {
    key: 'Nov',
    revenue: 2780,
    expense: 3908,
    orders: 3000,
  },
  {
    key: 'Dec',
    revenue: 7500,
    expense: 3000,
    orders: 400,
  },
];

const dailyData = [
  {
    key: 'Sat',
    revenue: 3500,
    expense: 1500,
    orders: 3200,
  },
  {
    key: 'Sun',
    revenue: 4600,
    expense: 3798,
    orders: 3600,
  },
  {
    key: 'Mon',
    revenue: 5900,
    expense: 1300,
    orders: 4000,
  },
  {
    key: 'Tue',
    revenue: 5780,
    expense: 3908,
    orders: 3800,
  },
  {
    key: 'Wed',
    revenue: 4890,
    expense: 2500,
    orders: 2900,
  },
  {
    key: 'Thu',
    revenue: 8000,
    expense: 3200,
    orders: 3500,
  },
  {
    key: 'Fri',
    revenue: 4890,
    expense: 2500,
    orders: 2500,
  },
];

const viewOptions = [
  {
    value: 'Daily',
    name: 'Daily',
  },
  {
    value: 'Monthly',
    name: 'Monthly',
  },
];

export default function OrderStats({ className }: { className?: string }) {
  const isTablet = useMedia('(max-width: 820px)', false);
  const [data, setData] = useState(dailyData);

  function handleChange(viewType: string) {
    if (viewType === 'Daily') {
      setData(dailyData);
    } else {
      setData(monthlyData);
    }
  }

  const loading = false;

  return (
    <WidgetCard
      title="Order Stats"
      titleClassName="font-normal sm:text-sm text-gray-500 mb-2.5 font-inter"
      description=""
      descriptionClassName="text-gray-500 mt-1.5"
      action={
        <div className="flex items-center justify-between gap-5">
          {/* <Legend className="hidden @2xl:flex @3xl:hidden @5xl:flex" /> */}
          <DropdownAction options={viewOptions} onChange={handleChange} />
        </div>
      }
      className={className}
    >
      {/* <Legend className="mt-2 flex @2xl:hidden @3xl:flex @5xl:hidden" /> */}
      {loading ? (
        <div className="mt-48">
          <Spinner />
        </div>
      ) : (
        <SimpleBar>
          <div className="h-96 w-full pt-9">
            <ResponsiveContainer
              width="100%"
              height="100%"
              {...(isTablet && { minWidth: '700px' })}
            >
              <ComposedChart
                data={data}
                barSize={isTablet ? 20 : 24}
                className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
              >
                <defs>
                  <linearGradient id="salesReport" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#F0F1FF"
                      className=" [stop-opacity:0.1]"
                    />
                    <stop offset="95%" stopColor="#8200E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <defs>
                  <linearGradient
                    id="colorUv"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#A5BDEC" />
                    <stop offset="0.8" stopColor="#477DFF" />
                    <stop offset="1" stopColor="#477DFF" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
                <XAxis dataKey="key" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={({ payload, ...rest }) => {
                    const pl = {
                      ...payload,
                      value: formatNumber(Number(payload.value)),
                    };
                    return (
                      <CustomYAxisTick prefix={''} payload={pl} {...rest} />
                    );
                  }}
                />
                <Tooltip
                  content={<CustomTooltip formattedNumber prefix="" />}
                />

                <Bar
                  dataKey="orders"
                  stackId="a"
                  barSize={40}
                  fill="url(#colorUv)"
                  stroke="#477DFF"
                  strokeOpacity={0.3}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SimpleBar>
      )}
    </WidgetCard>
  );
}

function Legend({ className }: { className?: string }) {
  return (
    <div className={cn('flex-wrap items-start gap-3 lg:gap-4', className)}>
      <span className="flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            background: `linear-gradient(180deg, #A5BDEC 0%, #477DFF 53.65%)`,
          }}
        />
        <span>Revenue</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#F5A623]" />
        <span>Expense</span>
      </span>
    </div>
  );
}
