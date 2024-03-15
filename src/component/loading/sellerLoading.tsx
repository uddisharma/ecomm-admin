import cn from '@/utils/class-names';
import { Skeleton } from '@/component/ui/skeleton';

interface SelectLoaderProps {
  className?: string;
}
const metricCardClasses = {
  base: 'border border-muted bg-gray-0 p-5 dark:bg-gray-50 lg:p-6',
  rounded: 'rounded-lg',
};

export default function SellerLoading({ className }: SelectLoaderProps) {
  return (
    <div
      className={cn(
        'cursor-pointer',
        metricCardClasses.base,
        metricCardClasses.rounded,
        className
      )}
    >
      <Skeleton
        // style={{
        //   height: '100px',
        //   width: '250px',
        //   borderRadius: '10px',
        //   marginTop: '-20px',
        // }}
        className="h-10 w-full rounded"
      />
    </div>
  );
}
