import cn from '@/utils/class-names';
import { Skeleton } from '@/component/ui/skeleton';

interface SelectLoaderProps {
  className?: string;
}

export default function TrackLoading({ className }: SelectLoaderProps) {
  return (
    <div className={cn(className)}>
      <Skeleton
        style={{
          height: '100px',
          width: '250px',
          borderRadius: '10px',
          marginTop: '-20px',
        }}
        className="h-10 w-full rounded"
      />
    </div>
  );
}
