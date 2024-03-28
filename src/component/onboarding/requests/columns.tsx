'use client';
import { HeaderCell } from '@/component/ui/table';
import { Text } from '@/component/ui/text';
import DateCell from '@/component/ui/date-cell';
import DeletePopover from '@/component/others/delete-popover';
import AvatarCard from '@/component/ui/avatar-card';
import StatusPopover from '@/component/others/orderStatusPopover';
type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  onMark: any;
};

export const getColumns = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  onMark,
}: Columns) => [
  {
    title: <HeaderCell title="Seller" />,
    dataIndex: 'amount',
    key: 'amount',
    width: 80,
    render: (_: any, row: any) => (
      <AvatarCard
        src={row?.seller_name}
        name={row?.seller_name}
        description={row?.email}
      />
    ),
  },
  {
    title: <HeaderCell title="Address" />,
    dataIndex: 'store_address',
    key: 'store_address',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.store_address ?? 'Shop Address (N/A)'}
      </Text>
    ),
  },

  {
    title: <HeaderCell title="Phone Number" />,
    dataIndex: 'phone',
    key: 'phone',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.phone ?? 'Mobile No (N/A)'}
      </Text>
    ),
  },
  {
    title: <HeaderCell title="Monthly Orders" />,
    dataIndex: 'monthly_orders',
    key: 'monthly_orders',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">{row?.monthly_orders}</Text>
    ),
  },

  {
    title: (
      <HeaderCell
        title="createdAt"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150,
    render: (createdAt: Date) => <DateCell date={createdAt} />,
  },
  {
    title: <HeaderCell title="Status" />,
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.status ? (
          <span className="font-semibold text-green-500">Completed</span>
        ) : (
          <span className="font-semibold text-red-500">Pending</span>
        )}
      </Text>
    ),
  },
  {
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 120,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <StatusPopover
          title={row?.status ? 'Mark as Pending' : 'Mark as Completed'}
          description={`Are you sure you want to mark this request?`}
          onDelete={() => onMark(row?.id, row?.status ? false : true)}
        />
        <DeletePopover
          title={`Delete the onboarding request`}
          description={`Are you sure you want to delete this request ?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
