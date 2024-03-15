'use client';

import Link from 'next/link';
import { HeaderCell } from '@/component/ui/table';
import { Badge } from '@/component/ui/badge';
import { Text } from '@/component/ui/text';
import { Tooltip } from '@/component/ui/tooltip';
import { ActionIcon } from '@/component/ui/action-icon';
import EyeIcon from '@/component/icons/eye';
import DateCell from '@/component/ui/date-cell';
import AddressCard from '@/component/ui/address-card';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { MdOutlineFileDownloadOff } from 'react-icons/md';
import StatusPopover from '@/component/others/orderStatusPopover';
import DeletePopover from '@/component/others/delete-popover';
import TemperoryDeletePopover from '@/component/others/temperory-delete-popover';
import RecyclePopover from '@/component/others/recycle-popover';
function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case 'received':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark ">{status}</Text>
        </div>
      );
    case 'dispatched':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">{status}</Text>
        </div>
      );
    case 'cancelled':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-red-dark">{status}</Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-gray-600">{status}</Text>
        </div>
      );
  }
}

type Columns = {
  sortConfig?: any;
  onDeleteItem: (id: string, status: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  temperoryDelete: any;
  updateStatus: any;
  deleteOrder: any;
};
const calculateTotalQuantity = (orderItems: any) => {
  let totalQuantity = 0;
  for (const item of orderItems) {
    totalQuantity += item.quantity;
  }
  return totalQuantity;
};

const findAddressById = (addresses: any, addressId: any) => {
  const foundAddress = addresses.find(
    (address: any) => address.id === addressId
  );

  if (foundAddress) {
    const { state, district, name, email, pincode } = foundAddress;
    return { state, district, name, email, pincode };
  } else {
    return null;
  }
};

export const getColumns = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  temperoryDelete,
  updateStatus,
  deleteOrder,
}: Columns) => [
  {
    title: <HeaderCell title="Order ID" />,
    dataIndex: 'id',
    key: 'id',
    width: 90,
    render: (_: any, row: any) => (
      <Link href={`/${row?.sellerId}/orders/${row.id}`}>
        <Text className="text-blue-900">
          #
          {row?.order && row?.courior != 'Local'
            ? row?.order?.order_id
            : row?.order_id}
        </Text>
      </Link>
    ),
  },
  {
    title: <HeaderCell title="Customer" />,
    dataIndex: 'customer',
    key: 'customer',
    width: 300,
    hidden: 'customer',
    render: (_: any, row: any) => (
      <AddressCard
        state={
          row?.customerId?.shippingAddress &&
          findAddressById(row.customerId?.shippingAddress, row?.addressId)?.name
        }
        district={
          row?.customerId?.shippingAddress &&
          findAddressById(
            row.customerId?.shippingAddress,
            row?.addressId
          )?.email.toLowerCase()
        }
      />
    ),
  },
  {
    title: <HeaderCell title="Ship To" />,
    dataIndex: 'address',
    key: 'address',
    width: 300,
    hidden: 'address',
    render: (_: any, row: any) => (
      <AddressCard
        state={
          row?.customerId?.shippingAddress &&
          findAddressById(row.customerId?.shippingAddress, row?.addressId)
            ?.state
        }
        district={`${
          row?.customerId?.shippingAddress &&
          findAddressById(row.customerId?.shippingAddress, row?.addressId)
            ?.district
        } (${
          row?.customerId?.shippingAddress &&
          findAddressById(row.customerId?.shippingAddress, row?.addressId)
            ?.pincode
        })`}
      />
    ),
  },
  {
    title: <HeaderCell title="Items" />,
    dataIndex: 'items',
    key: 'items',
    width: 150,
    render: (_: any, row: any) => (
      <Text className="font-medium text-gray-700">
        {row?.orderItems && calculateTotalQuantity(row?.orderItems)}
      </Text>
    ),
  },

  // {
  //   title: <HeaderCell title="Amount" />,
  //   dataIndex: 'totalAmount',
  //   key: 'totalAmount',
  //   width: 150,
  //   render: (_: any, row: any) => (
  //     <Text className="font-medium text-gray-700">₹{row?.totalAmount}</Text>
  //   ),
  // },

  {
    title: (
      <HeaderCell
        title="Amount"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'totalAmount'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('totalAmount'),
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 150,
    render: (totalAmount: any) => (
      <Text className="font-medium text-gray-700">₹{totalAmount}</Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Created"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 200,
    render: (value: Date) => <DateCell date={value} />,
  },

  {
    title: <HeaderCell title="Status" />,
    dataIndex: 'status',
    key: 'status',
    width: 140,
    render: (value: string) => getStatusBadge(value),
  },
  {
    // Need to avoid this issue -> <td> elements in a large <table> do not have table headers.
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 130,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        {row?.courior == 'Local' ? (
          <Tooltip
            size="sm"
            content={() => 'Download Label'}
            placement="top"
            color="invert"
          >
            <Link target="blank" href={`/label/${row.id}`}>
              <ActionIcon
                tag="span"
                size="sm"
                variant="outline"
                aria-label={'Label'}
                className="cursor-pointer hover:text-gray-700"
              >
                <AiOutlineCloudDownload className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
        ) : (
          <Tooltip
            size="sm"
            content={() => 'Download Label'}
            placement="top"
            color="invert"
          >
            <ActionIcon
              tag="span"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.open(row?.order?.label, '_blank');
              }}
              size="sm"
              variant="outline"
              aria-label={'Mark as'}
              className="hover:text-gray-700"
            >
              <AiOutlineCloudDownload className="h-4 w-4" />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip
          size="sm"
          content={() => 'View Order'}
          placement="top"
          color="invert"
        >
          <Link href={`/${row?.sellerId}/orders/${row.id}`}>
            <ActionIcon
              tag="span"
              size="sm"
              variant="outline"
              className="hover:text-gray-700"
            >
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>

        <StatusPopover
          title={
            row?.status == 'Dispatched'
              ? 'Mark as Pending'
              : 'Mark as Dispatched'
          }
          description={`Are you sure you want to mark this order ?`}
          onDelete={() =>
            updateStatus(
              row?.id,
              row?.status == 'Dispatched' ? 'Received' : 'Dispatched'
            )
          }
        />
        <RecyclePopover
          title={'Recycle deleted order'}
          description={`Are you sure you want to recycle deleted this order?`}
          onDelete={() => temperoryDelete(row?.id)}
        />
        <DeletePopover
          title={'Permanently deleted order'}
          description={`Are you sure you want to permanene delete this order?`}
          onDelete={() => deleteOrder(row?.id)}
        />
      </div>
    ),
  },
];
