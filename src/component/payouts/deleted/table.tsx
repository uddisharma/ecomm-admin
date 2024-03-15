'use client';

import { getColumns } from './columns';
import { useModal } from '@/component/modal-views/use-modal';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function DeletedPayoutsTable({
  data,
  temperoryDelete,
  onDeleteItem,
}: {
  data: any[];
  temperoryDelete: any;
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
            temperoryDelete: temperoryDelete,
            onDeleteItem: onDeleteItem,
          })
        }
        // enablePagination
        searchPlaceholder="Search Payout..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
