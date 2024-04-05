'use client';
import Image from 'next/image';
import { Title, Text } from '@/component/ui/text';
import { HeaderCell } from '@/component/ui/table';
import DeletePopover from '@/component/others/delete-popover';

type Columns = {
  sortConfig?: any;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};

export const getColumns = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  onChecked,
}: Columns) => [
  {
    title: <HeaderCell title="Image" />,
    dataIndex: 'image',
    key: 'image',
    width: 100,
    render: (_: any, row: any) => (
      <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt={row?.category?.name}
          src={row?.photo}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
        />
      </figure>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Category Name"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'name'
        }
      />
    ),
    dataIndex: 'name',
    key: 'name',
    width: 80,
    onHeaderCell: () => onHeaderCellClick('name'),
    render: (name: string, row: any) => (
      <Title as="h6" className="!text-sm font-medium">
        {row?.category?.name}{' '}
        {row?.category?.parentCategoryId?.parentCategoryId?.name == 'All' &&
          row?.category?.parentCategoryId?.name}
      </Title>
    ),
  },
  {
    title: <HeaderCell title="Parent Category" />,
    dataIndex: 'parent',
    key: 'description',
    width: 80,
    render: (_: string, row: any) => (
      <Text className="truncate !text-sm ">
        {row?.category?.parentCategoryId?.parentCategoryId?.name == 'All'
          ? row?.category?.parentCategoryId?.name
          : `${row?.category?.parentCategoryId?.parentCategoryId?.name} ${row?.category?.parentCategoryId?.name} wear`}
        wear
      </Text>
    ),
  },

  {
    title: <></>,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <DeletePopover
          title={`Delete the category`}
          description={`Are you sure you want to delete this  category?`}
          onDelete={() => onDeleteItem(row.category.id)}
        />
      </div>
    ),
  },
];
