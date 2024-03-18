'use client';

import { getColumns } from './columns';
import { useModal } from '@/component/modal-views/use-modal';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function OrderTable({
  data,

  onDeleteItem,
}: {
  data: any[];
  onDeleteItem: any;
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
            onDeleteItem: onDeleteItem,
          })
        }
        searchPlaceholder="Search Payout..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
