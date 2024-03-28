'use client';
import cn from '@/utils/class-names';
import BasicTableWidget from '../controlled-table/basic-table-widget';
interface DeliveryDetailsProps {
  order: any;
  className?: string;
}

export const getColumns = () => [
  {
    title: <span className="ms-6 block">Product</span>,
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
    render: (_: any, row: any) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'left',
          gap: '15px',
          alignItems: 'center',
        }}
      >
        <img
          src={row?.productId?.images && row?.productId?.images[0]}
          style={{ height: '50px', width: '50px', borderRadius: '50%' }}
          alt=""
        />
        <p>{row?.productId?.name}</p>
      </div>
    ),
  },
  {
    title: <span className="block">Color</span>,
    dataIndex: 'description',
    key: 'description',
    width: 50,
    render: (_: any, row: any) => <p>{row?.color}</p>,
  },
  {
    title: <span className="block">Size</span>,
    dataIndex: 'weight',
    key: 'weight',
    width: 50,
    render: (_: any, row: any) => <p>{row?.size}</p>,
  },
  {
    title: <span className="block">Price</span>,
    dataIndex: 'weight',
    key: 'weight',
    width: 50,
    render: (_: any, row: any) => <p>₹{row?.productId.price}</p>,
  },
  {
    title: <span className="block">Quantity</span>,
    dataIndex: '',
    key: '',
    align: 'center',
    width: '50px',
    render: (_: any, row: any) => (
      <p>
        {row?.quantity} {row?.quantity == 1 ? 'Item' : 'Items'}
      </p>
    ),
  },

  {
    title: <span className="me-6 block">Total</span>,
    dataIndex: 'total',
    key: 'total',
    align: 'center',
    width: '50px',
    render: (_: any, row: any) => <p>₹{row?.amount}</p>,
  },
];

export default function ShippingDetails({
  order,
  className,
}: DeliveryDetailsProps) {
  if (order?.orderItems) {
    return (
      <BasicTableWidget
        title="Ordered Products"
        className={cn(
          'pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0'
        )}
        data={order?.orderItems}
        getColumns={getColumns}
        noGutter
        enableSearch={false}
        scroll={{
          x: 900,
        }}
      />
    );
  }
}
