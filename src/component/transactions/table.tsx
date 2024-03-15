'use client';

import { getColumns } from './columns';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function OrderTable({
  data,
  temperoryDelete,
  onDelete,
}: {
  data: any[];
  temperoryDelete: any;
  onDelete: any;
}) {
  return (
    <>
      <BasicTableWidget
        title="Payouts"
        variant="minimal"
        data={data}
        key={Math.random()}
        // @ts-ignore
        getColumns={(columns: any) =>
          getColumns({
            ...columns,
            temperoryDelete: temperoryDelete,
            onDelete: onDelete,
          })
        }
        // enablePagination
        searchPlaceholder="Search coupons..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
