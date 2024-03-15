'use client';

import { getColumns } from './columns';
import { useModal } from '@/component/modal-views/use-modal';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function OrderTable({
  data,
  temperoryDelete,
  deleteProduct,
}: {
  data: any[];
  temperoryDelete: any;
  deleteProduct: any;
}) {
  const { openModal } = useModal();

  return (
    <>
      <BasicTableWidget
        title="Deleted Products"
        variant="minimal"
        data={data}
        key={Math.random()}
        // @ts-ignore
        getColumns={(columns: any) =>
          getColumns({
            ...columns,
            temperoryDelete: temperoryDelete,
            openModal: openModal,
            deleteProduct: deleteProduct,
          })
        }
        // enablePagination
        searchPlaceholder="Search orders..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
