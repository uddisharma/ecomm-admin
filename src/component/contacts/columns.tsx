'use client';
import { HeaderCell } from '@/component/ui/table';
import { Text } from '@/component/ui/text';
import DateCell from '@/component/ui/date-cell';
import { ActionIcon, Tooltip } from 'rizzui';
import DeletePopover from '@/component/others/delete-popover';
import AvatarCard from '@/component/ui/avatar-card';
import EyeIcon from '@/component/icons/eye';
import MessageModal from './messageModal';
import StatusPopover from '../others/orderStatusPopover';
type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onMark: (id: string, status: boolean) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  openModal: any;
};

export const getColumns = ({
  sortConfig,
  onDeleteItem,
  onMark,
  onHeaderCellClick,
  openModal,
}: Columns) => [
  {
    title: <HeaderCell title="User" />,
    dataIndex: 'amount',
    key: 'amount',
    width: 80,
    render: (_: any, row: any) => (
      <AvatarCard src={row?.name} name={row?.name} description={row?.email} />
    ),
  },
  {
    title: <HeaderCell title="Subject" />,
    dataIndex: 'subject',
    key: 'subject',
    width: 200,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.subject ?? 'Subject (N/A)'}
      </Text>
    ),
  },

  {
    title: <HeaderCell title="Phone Number" />,
    dataIndex: 'phone',
    key: 'phone',
    width: 100,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">{row?.phone}</Text>
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
          <span className="text-green-500">Completed</span>
        ) : (
          <span className="text-red-500">Pending</span>
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
        <Tooltip
          size="sm"
          content={() => 'View Message'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            onClick={() => {
              openModal({
                view: (
                  <MessageModal subject={row?.subject} message={row?.message} />
                ),
                customSize: '500px',
              });
            }}
            size="sm"
            variant="outline"
            aria-label={'Edit Coupon'}
          >
            <EyeIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
        <StatusPopover
          title={row?.status ? 'Mark as Pending' : 'Mark as Completed'}
          description={`Are you sure you want to mark this request?`}
          onDelete={() => onMark(row?.id, row?.status ? false : true)}
        />
        <DeletePopover
          title={`Delete the contact request`}
          description={`Are you sure you want to delete this request ?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
