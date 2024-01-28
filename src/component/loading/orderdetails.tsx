import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { Title, Text } from 'rizzui';
import cn from '@/utils/class-names';

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

const OrderDetailsLoadingPage = () => {
  return (
    <div className="@container">
      <div className="flex flex-wrap justify-center border-b border-t border-gray-300 py-4 align-middle font-medium text-gray-700 @5xl:justify-start">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="ml-3 h-10 w-[250px]" />
        <Skeleton className="ml-3 h-10 w-[200px]" />
        <Skeleton className="ml-3 h-10 w-[100px]" />
        <Skeleton className="ml-3 h-10 w-[100px]" />
        <Skeleton className="ml-3 h-10 w-[120px]" />
      </div>
      <div className="items-start pt-10 @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7">
          <TableLoadingPage />
        </div>
        <div className="space-y-7 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
          <WidgetCard
            title={'Customer Details'}
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="flex justify-between gap-5 align-middle">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[130px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </WidgetCard>

          <WidgetCard
            title={'Shipping Details'}
            childrenWrapperClass="@5xl:py-6 py-5"
          >
            <Skeleton className="h-4 w-3/4" />
            <br />
            <Skeleton className="h-4 w-2/3" />
            <br />
            <Skeleton className="h-4 w-3/4" />
            <br />
            <Skeleton className="h-4 w-2/3" />
            <br />
            <Skeleton className="h-4 w-3/4" />
            <br />
            <Skeleton className="h-4 w-2/3" />
            <br />
          </WidgetCard>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsLoadingPage;

const TableLoadingPage = () => {
  return (
    <table className="w-full border-collapse border-r-8">
      <thead>
        <tr>
          <th className="border p-2">ORDER ID</th>
          <th className="border p-2">SHIP TO</th>
          <th className="border p-2">ITEMS</th>
          <th className="border p-2">AMOUNT </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 4 }, (_, colIndex) => (
              <td key={colIndex} className="border p-2">
                {
                  <div className="flex items-center space-x-4">
                    {/* <Skeleton className="h-8 w-8 rounded-full" /> */}
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[130px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
