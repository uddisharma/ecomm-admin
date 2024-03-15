'use client';

import { getColumns } from './columns';
import { useModal } from '@/component/modal-views/use-modal';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function OrderTable({
  data,
  updateStatus,
  temperoryDelete,
  deleteOrder,
}: {
  data: any[];
  updateStatus: any;
  temperoryDelete: any;
  deleteOrder: any;
}) {
  const { openModal } = useModal();

  return (
    <>
      <BasicTableWidget
        title="Deleted Orders"
        variant="minimal"
        data={data}
        key={Math.random()}
        // @ts-ignore
        getColumns={(columns: any) =>
          getColumns({
            ...columns,
            temperoryDelete: temperoryDelete,
            openModal: openModal,
            updateStatus: updateStatus,
            deleteOrder: deleteOrder,
          })
        }
        // enablePagination
        searchPlaceholder="Search orders..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
