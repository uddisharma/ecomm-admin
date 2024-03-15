'use client';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';
import { metaObject } from '@/config/site.config';
import { EventsColumn } from './EventColumn';
import { useModal } from '@/component/modal-views/use-modal';

const metadata = {
  ...metaObject('Events'),
};

export default function DeletedTicketTable({
  data,
  onDeleteItem,
  onMark,
  user,
  temperoryDelete,
}: any) {
  const { openModal } = useModal();

  return (
    <div>
      {data && (
        <BasicTableWidget
          title=" Deleted Tickets"
          variant="minimal"
          data={data}
          // @ts-ignore
          // getColumns={EventsColumn}
          getColumns={(columns: any) =>
            EventsColumn({
              ...columns,
              onDeleteItem: onDeleteItem,
              openModal: openModal,
              onMark: onMark,
              user: user,
              temperoryDelete: temperoryDelete,
            })
          }
          // enablePagination
          searchPlaceholder="Search tickets..."
          className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
        />
      )}
    </div>
  );
}
