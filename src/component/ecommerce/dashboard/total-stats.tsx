'use client';

import cn from '@/utils/class-names';
import { Text } from '@/component/ui/text';
import WidgetCard from '@/component/cards/widget-card';
import CircleProgressBar from '@/component/charts/circle-progressbar';
import Spinner from '@/component/ui/spinner';

export default function TotalStats({
  className,
  data,
  isLoading,
  error,
  heading,
  footer,
}: {
  className?: string;
  data: any;
  isLoading: Boolean;
  error: Boolean;
  heading: string;
  footer: string;
}) {
  return (
    <WidgetCard
      title={heading}
      description=""
      titleClassName="font-normal text-gray-500 text-sm sm:text-sm 2xl:text-base font-inter"
      descriptionClassName="mt-2"
      headerClassName="col-span-full"
      className={cn(
        'relative grid grid-cols-2 place-content-between gap-5 pb-0 @2xl:gap-8 @3xl:gap-5 lg:pb-0',
        className
      )}
    >
      <div className="col-span-full grid w-full grid-cols-3 justify-around gap-5 @2xl:gap-12 @7xl:gap-8 @[1429px]:gap-4 @[1553px]:gap-8">
        {data.map((item: any) => (
          <div key={item.name} className={cn('grid gap-6 text-center')}>
            <CircleProgressBar
              percentage={item.percentage}
              size={120}
              stroke="#f0f0f0"
              strokeWidth={5}
              progressColor={item.color}
              useParentResponsive={true}
              label={
                <Text className="font-lexend text-sm font-bold text-gray-900 2xl:text-base dark:text-gray-700">
                  {isLoading ? (
                    <Spinner />
                  ) : error ? (
                    <Text className="text-xs">Something went wrong</Text>
                  ) : (
                    item.value
                  )}
                </Text>
              }
              strokeClassName="dark:stroke-gray-200"
            />
            <Text className="text-xs font-semibold text-gray-900 @md:text-sm @7xl:text-base dark:text-gray-700">
              {item.name}
            </Text>
          </div>
        ))}
      </div>
      <div className="col-span-full -mx-5 rounded-b-lg bg-gray-50 p-5 text-sm lg:-mx-7 lg:p-7 2xl:text-base">
        <p>{footer}</p>
      </div>
    </WidgetCard>
  );
}
