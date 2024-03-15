'use client';

import { getColumns } from './columns';
import BasicTableWidget from '@/component/controlled-table/basic-table-widget';

export default function UsersTable({
  data,

  onDeleteItem,
}: {
  data: any[];
  onDeleteItem: any;
}) {
  return (
    <>
      <BasicTableWidget
        title="Users"
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
        // enablePagination
        searchPlaceholder="Search User..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
