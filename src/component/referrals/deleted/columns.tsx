'use client';
import { HeaderCell } from '@/component/ui/table';
import { Text } from '@/component/ui/text';
import DateCell from '@/component/ui/date-cell';
import { Badge } from 'rizzui';
import Link from 'next/link';
import AddressCard from '@/component/ui/address-card';
import StatusPopover from '@/component/others/orderStatusPopover';
import RecyclePopover from '@/component/others/recycle-popover';
import DeletePopover from '@/component/others/delete-popover';
type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  permanentlydelete: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  updatePaid: (id: string, status: boolean) => void;
  updateOnboard: (id: string, status: boolean) => void;
  onDeleteItem: (id: string) => void;
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  permanentlydelete,
  onHeaderCellClick,
  handleSelectAll,
  updatePaid,
  updateOnboard,
  onChecked,
  onDeleteItem,
}: Columns) => [
  {
    title: <HeaderCell title="Seller" />,
    dataIndex: 'seller',
    key: 'seller',
    width: 80,
    render: (_: any, row: any) => (
      <Link
        className="cursor-pointer"
        href={`/${row?.referredSeller?.id}/shop`}
      >
        <AddressCard
          state={row?.referredSeller && row?.referredSeller?.shopname}
          district={row?.referredSeller && row?.referredSeller?.username}
        />
      </Link>
    ),
  },
  {
    title: <HeaderCell title="User" />,
    dataIndex: 'seller',
    key: 'seller',
    width: 50,
    render: (_: any, row: any) => (
      <Link
        className="cursor-pointer"
        href={`/users/${row?.referringUser?.id}/view`}
      >
        <AddressCard
          state={row?.referringUser && row?.referringUser?.name}
          district={row?.referringUser && row?.referringUser?.mobileNo}
        />
      </Link>
    ),
  },

  {
    title: <HeaderCell title="Amount" />,
    dataIndex: 'amount',
    key: 'amount',
    width: 50,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">₹{row?.amount}</Text>
    ),
  },
  {
    title: <HeaderCell title="Onboard Status" />,
    dataIndex: 'amount',
    key: 'amount',
    width: 50,
    render: (_: string, row: any) =>
      row?.onboarded ? (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark ">Completed</Text>
        </div>
      ) : (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">Pending</Text>
        </div>
      ),
  },
  {
    title: <HeaderCell title="Paid Status" />,
    dataIndex: 'amount',
    key: 'amount',
    width: 50,
    render: (_: string, row: any) =>
      row?.status ? (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark ">Completed</Text>
        </div>
      ) : (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">Pending</Text>
        </div>
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
        <StatusPopover
          title={
            row?.onboarded
              ? 'Mark as Onboard Pending '
              : 'Mark as Onboard Completed'
          }
          description={`Are you sure you want to mark this referral ?`}
          onDelete={() => updateOnboard(row.id, !row?.onboarded)}
        />

        <StatusPopover
          title={
            row?.status ? 'Mark as Paid Pending' : 'Mark as Paid Completed'
          }
          description={`Are you sure you want to mark this referral ?`}
          onDelete={() => updatePaid(row.id, !row?.status)}
        />

        <RecyclePopover
          title={`Recycle Deleted the Transaction`}
          description={`Are you sure you want to recycle deleted this transaction?`}
          onDelete={() => onDeleteItem(row.id)}
        />
        <DeletePopover
          title={`Permanently Delete the Transaction`}
          description={`Are you sure you want to permanently delete this transaction?`}
          onDelete={() => permanentlydelete(row.id)}
        />
      </div>
    ),
  },
];
