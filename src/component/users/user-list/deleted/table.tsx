'use client';
import { getColumns } from './columns';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';
export default function DeletedUsersTable({
  data,
  onDeleteItem,
  temperoryDelete,
}: {
  data: any[];
  onDeleteItem: any;
  temperoryDelete: any;
}) {
  return (
    <>
      <BasicTableWidget
        title="Deleted Users"
        variant="minimal"
        data={data}
        key={Math.random()}
        // @ts-ignore
        getColumns={(columns: any) =>
          getColumns({
            ...columns,
            onDeleteItem: onDeleteItem,
            temperoryDelete: temperoryDelete,
          })
        }
        searchPlaceholder="Search User..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
