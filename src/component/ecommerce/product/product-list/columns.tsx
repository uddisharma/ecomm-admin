'use client';

import Link from 'next/link';
import { HeaderCell } from '@/component/ui/table';
import { Text } from '@/component/ui/text';
import { Progressbar } from '@/component/ui/progressbar';
import { Tooltip } from '@/component/ui/tooltip';
import { ActionIcon } from '@/component/ui/action-icon';
import EyeIcon from '@/component/icons/eye';
import PencilIcon from '@/component/icons/pencil';
import AvatarCard from '@/component/ui/avatar-card';
import DateCell from '@/component/ui/date-cell';
import TemperoryDeletePopover from '@/component/others/temperory-delete-popover';

function getStockStatus(status: number) {
  if (status === 0) {
    return (
      <>
        <Progressbar
          value={status}
          color="danger"
          label={'out of stock'}
          className="h-1.5 w-24 bg-red/20"
        />
        <Text className="pt-1.5 text-[13px] text-gray-500">out of stock </Text>
      </>
    );
  } else if (status <= 20) {
    return (
      <>
        <Progressbar
          value={status}
          color="warning"
          label={'low stock'}
          className="h-1.5 w-24 bg-orange/20"
        />
        <Text className="pt-1.5 text-[13px] text-gray-500">
          {status} low stock
        </Text>
      </>
    );
  } else {
    return (
      <>
        <Progressbar
          value={status}
          color="success"
          label={'stock available'}
          className="h-1.5 w-24 bg-green/20"
        />
        <Text className="pt-1.5 text-[13px] text-gray-500">
          {status} in stock
        </Text>
      </>
    );
  }
}

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
  // {
  //   title: (
  //     <div className="ps-3.5">
  //       <Checkbox
  //         title={'Select All'}
  //         onChange={handleSelectAll}
  //         checked={checkedItems.length === data.length}
  //         className="cursor-pointer"
  //       />
  //     </div>
  //   ),
  //   dataIndex: 'checked',
  //   key: 'checked',
  //   width: 30,
  //   render: (_: any, row: any) => (
  //     <div className="inline-flex ps-3.5">
  //       <Checkbox
  //         className="cursor-pointer"
  //         checked={checkedItems.includes(row.id)}
  //         {...(onChecked && { onChange: () => onChecked(row.id) })}
  //       />
  //     </div>
  //   ),
  // },
  {
    title: <HeaderCell title="Product" />,
    dataIndex: 'product',
    key: 'product',
    width: 300,
    hidden: 'customer',
    render: (_: string, row: any) => (
      <AvatarCard
        src={row.images && row?.images}
        name={row.name}
        description={row.category?.name}
        avatarProps={{
          name: row.name,
          size: 'lg',
          className: 'rounded-lg',
        }}
      />
    ),
  },

  {
    title: (
      <HeaderCell
        title="Stock"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'stock'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('stock'),
    dataIndex: 'stock',
    key: 'stock',
    width: 200,
    render: (stock: number) => (
      <div
        style={{
          marginRight: '20px',
          maxWidth: '200px',
          overflowX: 'hidden',
        }}
      >
        {getStockStatus(stock)}
      </div>
    ),
  },
  {
    title: <HeaderCell title="Price" />,
    dataIndex: 'price',
    key: 'price',
    width: 100,
    render: (price: string) => <Text className="text-sm">₹{price}</Text>,
  },
  {
    title: <HeaderCell title="MRP" />,
    dataIndex: 'mrp',
    key: 'mrp',
    width: 100,
    render: (mrp: string) => <Text className="text-sm">₹{mrp}</Text>,
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
  // {
  //   title: <HeaderCell title="Rating" />,
  //   dataIndex: 'rating',
  //   key: 'rating',
  //   width: 200,
  //   render: (rating: number[]) => getRating(rating),
  // },
  // {
  //   title: <HeaderCell title="Status" />,
  //   dataIndex: 'status',
  //   key: 'status',
  //   width: 120,
  //   render: (value: string) => getStatusBadge(value),
  // },
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
          content={() => 'Edit Product'}
          placement="top"
          color="invert"
        >
          <Link href={`/${row?.sellerId}/products/${row?.id}/edit`}>
            <ActionIcon size="sm" variant="outline" aria-label={'Edit Product'}>
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip
          size="sm"
          content={() => 'View Product'}
          placement="top"
          color="invert"
        >
          <Link href={`/${row?.sellerId}/products/${row?.id}/view`}>
            <ActionIcon size="sm" variant="outline" aria-label={'View Product'}>
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <TemperoryDeletePopover
          title={`Temperory delete the product`}
          description={`Are you sure you want to temperory delete this product?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
