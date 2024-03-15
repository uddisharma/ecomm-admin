import { Badge } from '@/component/ui/badge';

export default function InvoiceDetails({ order }: any) {
  const formatdate = (date: any) => {
    const originalDate = new Date(date);
    const formattedDate = `${originalDate.getDate()}-${
      originalDate.getMonth() + 1
    }-${originalDate.getFullYear()}`;
    return formattedDate;
  };
  return (
    <div className="grid items-start rounded-xl border border-gray-300 p-5 @2xl:grid-cols-2 @3xl:grid-cols-3 @3xl:p-8 @5xl:grid-cols-4">
      <ul className="grid gap-3 @3xl:col-span-full @3xl:mb-2 @5xl:col-span-1 @5xl:mb-0">
        {order?.order && order?.courior != 'Local' && (
          <>
            <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
              <span className="font-semibold text-gray-900">Invoice No :</span>
              <span className="text-base font-semibold text-gray-900">
                #{order?.order?.awb_number}
              </span>
            </li>
            <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
              <span className="font-semibold text-gray-900">Order No :</span>
              <span className="text-base font-semibold text-gray-900">
                #{order?.order?.order_id}
              </span>
            </li>
            <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
              <span className="font-semibold text-gray-900">Shipment No :</span>
              <span className="text-base font-semibold text-gray-900">
                #{order?.order?.shipment_id}
              </span>
            </li>
            <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
              <span className="font-semibold text-gray-900">
                Payment Type :
              </span>
              {order?.order?.payment_type == 'cod' ? (
                <Badge color="info" rounded="md">
                  COD
                </Badge>
              ) : (
                <Badge color="success" rounded="md">
                  Paid
                </Badge>
              )}
            </li>
            <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
              <span className="font-semibold text-gray-900">
                Courier Name :
              </span>
              <span className="text-base font-semibold text-gray-900">
                {order?.order?.courier_name}
              </span>
            </li>
          </>
        )}
        {order?.courior == 'Local' && (
          <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
            <span className="font-semibold text-gray-900">
              Courior Service :
            </span>
            <span className="text-base font-semibold text-gray-900">
              {"Vendor's Local"} (Without tracking ID)
            </span>
          </li>
        )}
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Order Date :</span>
          <span className="text-base font-semibold text-gray-900">
            {formatdate(order?.createdAt)}
          </span>
        </li>
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Total Amount :</span>
          <span className="text-base font-semibold text-gray-900">
            ₹{order?.totalAmount}
          </span>
        </li>
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Discount Amount:</span>
          <span className="text-base font-semibold text-gray-900">
            ₹{order?.discount}
          </span>
        </li>
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Shipping Charge:</span>
          <span className="text-base font-semibold text-gray-900">
            ₹{order?.shipping}
          </span>
        </li>
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Order Note :</span>
          <span className="text-base font-semibold text-gray-900">
            {order?.note}
          </span>
        </li>
      </ul>
    </div>
  );
}
