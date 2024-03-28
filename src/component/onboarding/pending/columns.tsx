'use client';
import { HeaderCell } from '@/component/ui/table';
import { Text } from '@/component/ui/text';
import DateCell from '@/component/ui/date-cell';
import { ActionIcon, Tooltip } from 'rizzui';
import Link from 'next/link';
import DeletePopover from '@/component/others/delete-popover';
import AvatarCard from '@/component/ui/avatar-card';
import EyeIcon from '@/component/icons/eye';
import RecyclePopover from '@/component/others/recycle-popover';

type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  DeleteItem: any;
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  onDeleteItem,
  onHeaderCellClick,
  handleSelectAll,
  onChecked,
  DeleteItem,
}: Columns) => [
  {
    title: <HeaderCell title="Seller" />,
    dataIndex: 'amount',
    key: 'amount',
    width: 80,
    render: (_: any, row: any) => (
      <AvatarCard
        src={row?.username}
        name={row?.email}
        description={row?.username}
      />
    ),
  },
  {
    title: <HeaderCell title="Shop Name" />,
    dataIndex: 'shopname',
    key: 'shopname',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.shopname ?? 'Shop Name (N/A)'}
      </Text>
    ),
  },

  {
    title: <HeaderCell title="Phone Number" />,
    dataIndex: 'mobileNo',
    key: 'mobileNo',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.mobileNo ?? 'Mobile No (N/A)'}
      </Text>
    ),
  },
  {
    title: <HeaderCell title="Shop Address" />,
    dataIndex: 'shopaddress',
    key: 'shopaddress',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.shopaddress
          ? `${row?.shopaddress?.city} ${row?.shopaddress?.state}`
          : 'Shop Address (N/A)'}
      </Text>
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
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 120,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={() => 'View Seller'}
          placement="top"
          color="invert"
        >
          <Link href={`/${row?.id}/shop`}>
            <ActionIcon size="sm" variant="outline" aria-label={'View Seller'}>
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        {!row?.isDeleted && (
          <DeletePopover
            title={
              !row?.isDeleted
                ? `Temperory Delete the Seller`
                : `Recycle this seller`
            }
            description={`Are you sure you want to ${
              !row?.isDeleted
                ? 'temperory delete this seller?'
                : 'recycle this seller'
            } `}
            onDelete={() => onDeleteItem(row.id)}
          />
        )}
        {row?.isDeleted && (
          <RecyclePopover
            title={`Recycle this seller`}
            description={`Are you sure you want to recycle this seller
            `}
            onDelete={() => onDeleteItem(row.id)}
          />
        )}
        {row?.isDeleted && (
          <DeletePopover
            title={`Permanently Delete the Seller`}
            description={`Are you sure you want to permanently delete this seller ? `}
            onDelete={() => DeleteItem(row.id)}
          />
        )}
      </div>
    ),
  },
];
