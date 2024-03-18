'use client';

import { useState } from 'react';
import WidgetCard from '@/component/cards/widget-card';
import { DatePicker } from '@/component/ui/datepicker';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { useMedia } from '@/hooks/use-media';
import { CustomYAxisTick } from '@/component/charts/custom-yaxis-tick';
import { CustomTooltip } from '@/component/charts/custom-tooltip';
import SimpleBar from '@/component/ui/simplebar';
import { formatNumber } from '@/utils/format-number';
import Spinner from '@/component/ui/spinner';
import { BaseApi, adminmonthwiseRevenue } from '@/constants';
import useSWR from 'swr';
import axios from 'axios';
import { Empty, SearchNotFoundIcon } from 'rizzui';

export default function RevenueStats({ className }: { className?: string }) {
  const isTablet = useMedia('(max-width: 820px)', false);
  const [startDate, setStartDate] = useState<Date>(new Date());

  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let {
    data: newdata,
    isLoading,
    error,
  } = useSWR(
    `${BaseApi}${adminmonthwiseRevenue}?year=${startDate?.getFullYear()}`,
    fetcher,
    {
      refreshInterval: 3600000,
    }
  );

  const newdata1 = newdata?.map((e: any) => {
    return { month: e?.month?.slice(0, 3), revenue: e?.totalRevenue };
  });

  return (
    <WidgetCard
      title={'Monthly Revenue'}
      description=""
      descriptionClassName="text-gray-500 mt-1.5"
      action={
        <DatePicker
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          dateFormat="yyyy"
          placeholderText="Select Year"
          showYearPicker
          inputProps={{ variant: 'text', inputClassName: 'p-0 px-1 h-auto' }}
          popperPlacement="bottom-end"
          className="w-[100px]"
        />
      }
      className={className}
    >
      {error ? (
        <div style={{ paddingBottom: '50px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : isLoading ? (
        <div className="mt-48 pb-48">
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
                data={newdata1}
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
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
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
                  dataKey="revenue"
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
