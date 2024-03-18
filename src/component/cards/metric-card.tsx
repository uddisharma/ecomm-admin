'use client';

import { Text } from '@/component/ui/text';
import cn from '@/utils/class-names';
import Spinner from '../ui/spinner';

const metricCardClasses = {
  base: 'border border-gray-200 bg-gray-0 p-5 dark:bg-gray-50 lg:p-6',
  rounded: {
    sm: 'rounded-sm',
    DEFAULT: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
  },
};

type MetricCardTypes = {
  title: string;
  metric: React.ReactNode;
  icon?: React.ReactNode;
  isLoading: Boolean;
  error: Boolean;
  iconClassName?: string;
  contentClassName?: string;
  chart?: React.ReactNode;
  info?: React.ReactNode;
  rounded?: keyof typeof metricCardClasses.rounded;
  titleClassName?: string;
  metricClassName?: string;
  chartClassName?: string;
  className?: string;
};

export default function MetricCard({
  title,
  metric,
  icon,
  isLoading,
  error,
  chart,
  info,
  rounded = 'DEFAULT',
  className,
  iconClassName,
  contentClassName,
  titleClassName,
  metricClassName,
  chartClassName,
  children,
}: React.PropsWithChildren<MetricCardTypes>) {
  return (
    <div
      className={cn(
        metricCardClasses.base,
        metricCardClasses.rounded[rounded],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon ? (
            <div
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 lg:h-12 lg:w-12',
                iconClassName
              )}
            >
              {icon}
            </div>
          ) : null}

          <div className={cn(icon && 'ps-3', contentClassName)}>
            <Text className={cn('mb-0.5 text-gray-500', titleClassName)}>
              {title}
            </Text>
            <Text
              className={cn(
                'font-lexend text-lg font-semibold text-gray-900 2xl:xl:text-xl dark:text-gray-700',
                metricClassName
              )}
            >
              {isLoading ? (
                <Spinner className="mt-3 h-4 w-4" />
              ) : error ? (
                <span className="text-xs">Something went wrong</span>
              ) : (
                metric
              )}
            </Text>

            {info ? info : null}
          </div>
        </div>

        {chart ? (
          <div className={cn('h-12 w-20', chartClassName)}>{chart}</div>
        ) : null}
      </div>

      {children}
    </div>
  );
}
