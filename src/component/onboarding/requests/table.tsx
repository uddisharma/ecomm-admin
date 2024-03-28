'use client';

import { useModal } from '@/component/modal-views/use-modal';
import { getColumns } from './columns';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function ContactTable({
  data = [],
  onDelete,
  onMark,
}: {
  data: any[];
  onDelete: any;
  onMark: any;
}) {
  const { openModal } = useModal();

  return (
    <>
      <BasicTableWidget
        title="Onboarding Requests"
        variant="minimal"
        data={data}
        key={Math.random()}
        // @ts-ignore
        getColumns={(columns: any) =>
          getColumns({
            ...columns,
            onDeleteItem: onDelete,
            openModal: openModal,
            onMark: onMark,
          })
        }
        // enablePagination
        searchPlaceholder="Search requests..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
