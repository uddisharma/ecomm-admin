'use client';
import { HeaderCell } from '@/component/ui/table';
import { Text } from '@/component/ui/text';
import DateCell from '@/component/ui/date-cell';
import DeletePopover from '../others/delete-popover';
import Link from 'next/link';
import { ActionIcon, Tooltip } from 'rizzui';
import EyeIcon from '../icons/eye';
import PencilIcon from '../icons/pencil';
import TemperoryDeletePopover from '../others/temperory-delete-popover';

type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  temperoryDelete: any;
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  onDeleteItem,
  onHeaderCellClick,
  handleSelectAll,
  onChecked,
  temperoryDelete,
}: Columns) => [
  {
    title: <HeaderCell title="Coupon Code" />,
    dataIndex: 'code',
    key: 'code',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">{row?.code}</Text>
    ),
  },

  {
    title: <HeaderCell title="Discount Type" />,
    dataIndex: 'discount_type',
    key: 'discount_type',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.discount_type?.toUpperCase()}
      </Text>
    ),
  },

  {
    title: <HeaderCell title="Discount" />,
    dataIndex: 'discount',
    key: 'discount',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.discount_type == 'percentage'
          ? `${row?.discount}%`
          : `₹${row?.discount}`}
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
    width: 100,
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
          content={() => 'Edit Coupon'}
          placement="top"
          color="invert"
        >
          <Link href={`/${row?.seller}/coupons/${row?.id}/edit`}>
            <ActionIcon size="sm" variant="outline" aria-label={'Edit Coupon'}>
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip
          size="sm"
          content={() => 'View Coupon'}
          placement="top"
          color="invert"
        >
          <Link href={`/${row?.seller}/coupons/${row?.id}/view`}>
            <ActionIcon size="sm" variant="outline" aria-label={'View Coupon'}>
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <TemperoryDeletePopover
          title={`Temperory Delete the Coupon`}
          description={`Are you sure you want to temperory delete this coupon?`}
          onDelete={() => temperoryDelete(row.id)}
        />
      </div>
    ),
  },
];
