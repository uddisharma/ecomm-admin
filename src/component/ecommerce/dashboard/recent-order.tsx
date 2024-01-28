import { orderData } from '@/data/order-data';

import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function RecentOrder({ className }: { className?: string }) {
  return (
    <BasicTableWidget
      title={'Recent Order'}
      data={orderData}
      // @ts-ignore
      getColumns={getWidgetColumns}
      className={className}
      enablePagination
      noGutter
      searchPlaceholder="Search order..."
      variant="modern"
    />
  );
}
