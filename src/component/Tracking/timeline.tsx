'use client';
import { Title, Text } from '@/component/ui/text';
import cn from '@/utils/class-names';
import { PiCheckCircle, PiTriangle } from 'react-icons/pi';

export default function Timeline({
  data,
  className,
  showmoreButton = false,
  order = 'asc',
}: {
  data: object[];
  className?: string;
  showmoreButton?: boolean;
  order?: 'asc' | 'desc';
}) {
  return (
    <div className={cn('relative @container', className)}>
      {data.map((timeline: any, index: number) => (
        <div className="flex items-center" key={`timeline-${index}`}>
          <div className="hidden w-[147px] flex-shrink-0 @lg:block">
            <Text as="span" className="pe-5 text-gray-500 @2xl:pe-10">
              {timeline.message}
            </Text>
          </div>
          <div
            className={cn(
              'relative flex-grow border-s border-gray-200 py-5 ps-10 before:absolute before:-left-[3px] before:-top-[3px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-gray-200 rtl:before:-right-[3px] dark:border-gray-700 dark:before:bg-gray-900',
              index === data.length - 1 &&
                'before:-bottom-[3px] before:top-auto before:block'
            )}
          >
            <span className="absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-0 rtl:-right-3 dark:bg-gray-50">
              {index == 0 ? (
                <PiCheckCircle className="h-6 w-6 text-green" />
              ) : (
                <PiTriangle className="h-5 w-5" />
              )}
            </span>
            <Title
              as="h3"
              className={cn(
                'mb-3 flex items-center text-base font-semibold',
                'text-gray-900'
              )}
            >
              {timeline?.message}
            </Title>
            <div className="relative -ms-10">
              <div className="ps-10">
                <Text className=" text-sm font-normal leading-loose text-gray-500">
                  {timeline?.location}
                  <Text as="span" className="block font-medium text-gray-700">
                    {timeline?.event_time}
                  </Text>{' '}
                </Text>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
