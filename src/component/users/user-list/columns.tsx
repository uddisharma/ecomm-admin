'use client';

import Link from 'next/link';
import { HeaderCell } from '@/component/ui/table';
import { Text } from '@/component/ui/text';
import { Tooltip } from '@/component/ui/tooltip';
import { ActionIcon } from '@/component/ui/action-icon';
import EyeIcon from '@/component/icons/eye';
import PencilIcon from '@/component/icons/pencil';
import DateCell from '@/component/ui/date-cell';
import { PiPackageDuotone } from 'react-icons/pi';
import TemperoryDeletePopover from '@/component/others/temperory-delete-popover';

type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  onDeleteItem,
  onHeaderCellClick,
  handleSelectAll,
  onChecked,
}: Columns) => [
  {
    title: <HeaderCell title="User" />,
    dataIndex: 'name',
    key: 'name',
    width: 300,
    hidden: 'name',
    render: (_: any, row: any) => <Text className="text-sm">{row?.name}</Text>,
  },
  {
    title: <HeaderCell title="Email" />,
    dataIndex: 'email',
    key: 'email',
    width: 300,
    hidden: 'email',
    render: (_: any, row: any) => <Text className="text-sm">{row?.email}</Text>,
  },
  {
    title: <HeaderCell title="Mobile No." />,
    dataIndex: 'mobileNo',
    key: 'mobileNo',
    width: 300,
    hidden: 'mobileNo',
    render: (_: any, row: any) => (
      <Text className="text-sm">{row?.mobileNo}</Text>
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
    // Need to avoid this issue -> <td> elements in a large <table> do not have table headers.
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 120,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={() => 'Edit User'}
          placement="top"
          color="invert"
        >
          <Link href={`/users/${row?.id}/edit`}>
            <ActionIcon size="sm" variant="outline" aria-label={'Edit User'}>
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip
          size="sm"
          content={() => 'View User'}
          placement="top"
          color="invert"
        >
          <Link href={`/users/${row?.id}/view`}>
            <ActionIcon size="sm" variant="outline" aria-label={'View User'}>
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip
          size="sm"
          content={() => 'View Orders'}
          placement="top"
          color="invert"
        >
          <Link href={`/users/${row?.id}/orders`}>
            <ActionIcon size="sm" variant="outline" aria-label={'View User'}>
              <PiPackageDuotone className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <TemperoryDeletePopover
          title={`Temperory Delete the User`}
          description={`Are you sure you want to temperory delete this User?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
