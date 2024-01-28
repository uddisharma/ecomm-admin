import cn from '@/utils/class-names';
import { Skeleton } from '@/component/ui/skeleton';

interface SelectLoaderProps {
  className?: string;
}

export default function BannerLoading({ className }: SelectLoaderProps) {
  return (
    <div className={cn(className)}>
      <Skeleton
        style={{ height: '200px', borderRadius: '10px' }}
        className="h-10 w-full rounded"
      />
    </div>
  );
}
