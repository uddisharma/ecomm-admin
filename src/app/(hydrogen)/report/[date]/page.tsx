'use client';
import cn from '@/utils/class-names';
import { Button } from 'rizzui';
import * as XLSX from 'xlsx';
import PageHeader from '@/component/others/pageHeader';
import { useEffect, useState } from 'react';
import { BaseApi, adminOrders, admindatewiseStats } from '@/constants';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { PiArrowLineDownBold, PiArrowLineUpBold } from 'react-icons/pi';
function convertDateFormat(inputDate: any) {
  const parsedDate = new Date(inputDate);
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }
  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear();
  const outputDate = `${month.toString().padStart(2, '0')}/${day
    .toString()
    .padStart(2, '0')}/${year}`;
  return outputDate;
}

function PromoBanner() {
  const params = useParams();
  const [date, setDate] = useState<string>('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(false);
  const [d_data1, setD_data1] = useState<any>([]);
  const [d_data2, setD_data2] = useState<any>([]);

  const pageHeader = {
    title: 'Download Report',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/report',
        name: 'Download Report',
      },
      {
        name: String(params?.date),
      },
    ],
  };

  const comprehensive = () => {
    setLoading1(true);
    axios
      .get(`${BaseApi}${admindatewiseStats}?date=${date}`)
      .then((res) => {
        if (res.data?.status != 'SUCCESS') {
          return toast.error('Something went wrong ! while downloading report');
        }
        if (res.data?.data) {
          setD_data1([{ ...res?.data?.data }]);
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong ! while downloading report');
      })
      .finally(() => {
        setLoading1(false);
      });
  };

  function convertToISOFormat(inputDate: any) {
    const dateComponents = inputDate.split('/');
    const isoDate = `${dateComponents[2]}-${dateComponents[0].padStart(
      2,
      '0'
    )}-${dateComponents[1].padStart(2, '0')}`;

    return isoDate;
  }

  const orderlist = () => {
    setLoading2(true);
    axios
      .get(
        `${BaseApi}${adminOrders}?date=${convertToISOFormat(
          date
        )}&status=All&courior=All&page=${1}&limit=${100000}`
      )
      .then((res) => {
        if (res.data?.status == 'SUCCESS') {
          const orders = res.data?.data?.data;
          const calculateTotalQuantity = (orderItems: any) => {
            let totalQuantity = 0;
            for (const item of orderItems) {
              totalQuantity += item.quantity;
            }
            return totalQuantity;
          };

          const newdata =
            orders &&
            orders?.length &&
            orders?.map((e: any) => {
              return {
                orderId: e.order_id,
                customer: e.customerId
                  ? `${e.customerId.name} ${e.customerId.email}`
                  : '',
                shippingAddress: e.customerId
                  ? `${e.customerId.shippingAddress.find(
                      (address: any) => address._id === e.addressId
                    )?.address} ${e.customerId.shippingAddress.find(
                      (address: any) => address._id === e.addressId
                    )?.district} ${e.customerId.shippingAddress.find(
                      (address: any) => address._id === e.addressId
                    )?.state}`
                  : '',
                orderedProducts: e.orderItems
                  .map((item: any) => {
                    const formattedProduct = `${item.productId.name}-${item.quantity}-${item.color.name}-${item.size}`;
                    return formattedProduct;
                  })
                  .join(' | '),
                totalAmount: e.totalAmount,
                totalItems: calculateTotalQuantity(e.orderItems),
                shippingCost: e.shipping,
                discount: e.discount,
                courier: e.courior == 'Local' ? 'Local' : 'Serviceable',
                note: e.note,
                paymentStatus: e.payment ? 'paid' : 'Not Paid',
                orderStatus: e.status,
                charge: e.charge,
              };
            });
          setD_data2(newdata);
        }
        if (res.data?.status == 'RECORD_NOT_FOUND') {
          return toast.warning(`No Data Found for ${params?.date}`);
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong ! while downloading report');
      })
      .finally(() => {
        setLoading2(false);
      });
  };

  useEffect(() => {
    const formattedDate = convertDateFormat(params?.date);
    if (formattedDate == 'Invalid date') {
      return setError(true);
    }
    setDate(formattedDate);
  }, []);

  const exportToExcel = (data: any, filename: any) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + '.xlsx');
  };

  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <div
        className={cn(
          'relative mt-2 flex flex-col items-center overflow-hidden rounded-xl border border-gray-300 xs:flex-row'
        )}
      >
        <div className="relative h-full min-h-[200px] w-full sm:max-w-[223px]">
          <img
            className=" rounded-t-xl object-cover xs:rounded-none xs:rounded-s-xl"
            src="/calendor.png"
            style={{ display: 'block', margin: 'auto', marginTop: '40px' }}
            alt=""
          />
        </div>

        <div className="flex w-full flex-col justify-between p-5 pb-6 sm:p-6">
          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
            Download the comprehensive details for{' '}
            <span className="text-sm"> {` ${params?.date}`}</span>
          </h5>
          <p className="mb-2 text-sm font-normal text-gray-500">
            It encompasses all details excluding the order list.
          </p>

          <div className="mt-4 flex flex-col items-center gap-3 @lg:mt-0 lg:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto lg:w-auto dark:bg-gray-100 dark:text-white"
              onClick={comprehensive}
              disabled={error}
              isLoading={loading1}
            >
              <PiArrowLineDownBold className="me-1.5 h-[17px] w-[17px]" />
              {error ? 'Invalid Date' : 'Download'}
            </Button>
            {d_data1?.length > 0 && (
              <Button
                disabled={d_data1?.length <= 0}
                variant="outline"
                onClick={() =>
                  exportToExcel(d_data1, `${params?.date}-comprehensive`)
                }
                className="mt-3 w-full sm:w-auto lg:mt-0 lg:w-auto dark:bg-gray-100 dark:text-white"
              >
                <PiArrowLineUpBold className="me-1.5 h-[17px] w-[17px]" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'relative mb-20 mt-10 flex flex-col items-center overflow-hidden rounded-xl border border-gray-300 xs:flex-row'
        )}
      >
        <div className="relative h-full min-h-[200px] w-full sm:max-w-[223px]">
          <img
            className=" rounded-t-xl object-cover xs:rounded-none xs:rounded-s-xl"
            src="/report.png"
            style={{ display: 'block', margin: 'auto', marginTop: '40px' }}
            alt=""
          />
        </div>

        <div className="flex flex-col justify-between p-5 pb-6 sm:p-6">
          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
            Download the order list for{' '}
            <span className="text-sm"> {` ${params?.date}`}</span>
          </h5>
          <p className="mb-5 text-sm font-normal text-gray-500">
            This encompasses the complete list of orders for the day.
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 @lg:mt-0 lg:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto lg:w-auto dark:bg-gray-100 dark:text-white"
              onClick={orderlist}
              disabled={error}
              isLoading={loading2}
            >
              <PiArrowLineDownBold className="me-1.5 h-[17px] w-[17px]" />
              {error ? 'Invalid Date' : 'Download'}
            </Button>
            {d_data2?.length > 0 && (
              <Button
                disabled={d_data2?.length <= 0}
                variant="outline"
                onClick={() => exportToExcel(d_data2, `${params?.date}-orders`)}
                className="mt-3 w-full sm:w-auto lg:mt-0 lg:w-auto dark:bg-gray-100 dark:text-white"
              >
                <PiArrowLineUpBold className="me-1.5 h-[17px] w-[17px]" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default PromoBanner;
