'use client';
import cn from '@/utils/class-names';
import OrderCard from './ordercard';
export default function OrdersList({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-12 gap-5 @7xl:gap-10', className)}>
      <div className="col-span-full @5xl:col-span-9">
        <OrderCard />
      </div>
    </div>
  );
}
