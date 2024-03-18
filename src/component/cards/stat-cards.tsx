'use client';

import cn from '@/utils/class-names';
import MetricCard from './metric-card1';
import TagIcon2 from '@/component/icons/tag-2';
export default function StatCards({
  className,
  data,
}: {
  className?: string;
  data: any;
}) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9', className)}
    >
      {data.map((e: any) => (
        <MetricCard
          key={e.id}
          title={e?.shopname}
          seller={e?.id}
          metric={e?.username}
          isActive={e?.isActive}
          isOnboarded={e?.isOnboarded}
          icon={<TagIcon2 className="h-full w-full" />}
          iconClassName="bg-transparent w-11 h-11"
        />
      ))}
    </div>
  );
}
