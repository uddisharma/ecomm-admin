'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi';
import ControlledTable from '@/component/controlled-table';
import { getColumns } from '@/component/ecommerce/order/order-list/columns';
import { ActionIcon } from '@/component/ui/action-icon';
import ExpandedOrderRow from '@/component/ecommerce/order/order-list/expanded-row';
import cn from '@/utils/class-names';

function CustomExpandIcon(props: any) {
  return (
    <ActionIcon
      size="sm"
      variant="outline"
      rounded="full"
      className="expand-row-icon ms-2"
      onClick={(e) => {
        props.onExpand(props.record, e);
      }}
    >
      {props.expanded ? (
        <PiCaretUpBold className="h-3.5 w-3.5" />
      ) : (
        <PiCaretDownBold className="h-3.5 w-3.5" />
      )}
    </ActionIcon>
  );
}

const filterState = {
  price: ['', ''],
  createdAt: [null, null],
  updatedAt: [null, null],
  status: '',
};

export default function OrderTable({
  data = [],
  variant = 'modern',
  className,
  updateStatus,
}: {
  data: any[];
  variant?: 'modern' | 'minimal' | 'classic' | 'elegant' | 'retro';
  className?: string;
  updateStatus: any;
}) {
  const [pageSize, setPageSize] = useState(10);

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = useCallback((id: string, status: string) => {
    updateStatus(id, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isLoading,
    isFiltered,
    tableData,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    handleDelete,
  } = useTable(data, pageSize, filterState);

  const columns = useMemo(
    () => getColumns({ sortConfig, onHeaderCellClick, onDeleteItem }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onHeaderCellClick, sortConfig.key, sortConfig.direction, onDeleteItem]
  );

  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);

  return (
    <div className={cn(className)}>
      <ControlledTable
        variant={variant}
        isLoading={isLoading}
        showLoadingText={true}
        data={tableData}
        // @ts-ignore
        columns={visibleColumns}
        expandable={{
          expandIcon: CustomExpandIcon,
          expandedRowRender: (record) => <ExpandedOrderRow record={record} />,
        }}
        filterOptions={{
          searchTerm,
          onSearchClear: () => {
            handleSearch('');
          },
          onSearchChange: (event) => {
            handleSearch(event.target.value);
          },
          hasSearched: isFiltered,
          hideIndex: 1,
          columns,
          checkedColumns,
          setCheckedColumns,
          enableDrawerFilter: true,
        }}
        className={
          'overflow-hidden rounded-md border border-gray-200 text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0'
        }
      />
    </div>
  );
}
