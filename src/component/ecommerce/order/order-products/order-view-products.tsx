'use client';

import Image from 'next/image';
import Table, { HeaderCell } from '@/component/ui/table';
import { useCart } from '@/store/quick-cart/cart.context';
import { Title, Text } from '@/component/ui/text';
import { toCurrency } from '@/utils/to-currency';
import { CartItem } from '@/types';

const columns = [
  {
    title: <HeaderCell title="Product" />,
    dataIndex: 'product',
    key: 'product',
    width: 250,
    render: (_: any, row: any) => (
      <div className="flex items-center">
        <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
          <Image
            alt={row?.productId?.name}
            src={row.productId?.images && row?.productId?.images}
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
        <div className="ms-4">
          <Title as="h6" className="!text-sm font-medium">
            {row.productId?.name}
          </Title>
        </div>
      </div>
    ),
  },
  {
    title: <HeaderCell title="Price" align="right" />,
    dataIndex: 'price',
    key: 'price',
    width: 70,
    render: (_: any, row: any) => (
      <Text className="text-end text-sm">₹{row?.productId?.price}</Text>
    ),
  },

  {
    title: <HeaderCell title="Size" align="center" />,
    dataIndex: 'size',
    key: 'size',
    width: 70,
    render: (_: any, row: any) => (
      <Text className="text-center text-sm font-semibold">{row?.size}</Text>
    ),
  },
  {
    title: <HeaderCell title="Color" align="center" />,
    dataIndex: 'color',
    key: 'color',
    width: 150,
    render: (_: any, row: any) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '5px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            height: '15px',
            width: '15px',
            borderRadius: '50%',
            backgroundColor: `${row?.color?.code}`,
          }}
        ></div>
        <Text className="text-center text-sm font-semibold">
          {row?.color?.name}
        </Text>
      </div>
    ),
  },
  {
    title: <HeaderCell title="Quantity" align="center" />,
    dataIndex: 'quantity',
    key: 'quantity',
    width: 70,
    render: (_: any, row: any) => (
      <Text className="text-center text-sm font-semibold">{row?.quantity}</Text>
    ),
  },
  {
    title: <HeaderCell title="Amount" align="right" />,
    dataIndex: 'price',
    key: 'price',
    width: 200,
    render: (_: any, row: any) => (
      <Text className="text-end text-sm">₹{row?.amount}</Text>
    ),
  },
];

export default function OrderViewProducts({ products }: any) {
  return (
    <Table
      data={products}
      // @ts-ignore
      columns={columns}
      className="text-sm"
      variant="minimal"
      rowKey={(record) => record.id}
      scroll={{ x: 800 }}
    />
  );
}
