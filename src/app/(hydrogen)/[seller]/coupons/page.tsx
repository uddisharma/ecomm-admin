'use client';
import PageHeader from '@/component/others/pageHeader';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/component/others/export-button';
import Pagination from '@/component/ui/pagination';
import Link from 'next/link';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import { useFilterControls } from '@/hooks/use-filter-control';
import { useContext, useState } from 'react';
import { UserContext } from '@/store/user/context';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  coupons,
  couponsPerPage,
  deleteCoupon,
  updateCoupon,
} from '@/constants';
import CouponsTable from '@/component/coupons/table';
import CouponLoadingPage from '@/component/loading/coupons';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { MdOutlineAutoDelete } from 'react-icons/md';
const metadata = {
  ...metaObject('Coupons'),
};

const pageHeader = {
  title: 'Coupons',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/',
      name: 'Coupons',
    },
    {
      name: 'List',
    },
  ],
};

export default function Coupons() {
  const initialState = {
    page: '',
  };
  const { state: st, paginate } = useFilterControls<typeof initialState, any>(
    initialState
  );
  const params = useParams();
  const [page, setPage] = useState(st?.page ? st?.page : 1);
  const { state } = useContext(UserContext);
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${coupons}/${params?.seller}?page=${page}&limit=${couponsPerPage}&isDeleted=${false}`,
    fetcher,
    {
      refreshInterval: 3600000,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      onErrorRetry({ retrycount }: any) {
        if (retrycount > 3) {
          return false;
        }
      },
    }
  );
  const pagininator = data?.data?.paginator;
  data = data?.data?.data;

  const onDelete = async (id: any) => {
    try {
      await axios.delete(`${BaseApi}${deleteCoupon}/${id}`);
      await mutate();
      return toast.success('Coupon Deleted Successfully !');
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const temperoryDelete = async (id: string) => {
    try {
      await axios.patch(`${BaseApi}${updateCoupon}/${id}`, {
        isDeleted: true,
      });
      await mutate();
      return toast.success('Coupon is Temperory Deleted Successfully !');
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const coupons1: any = [];
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="coupons_data" header="" />
          <Link
            href={`/${params?.seller}/coupons/create`}
            className="w-full @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Coupon
            </Button>
          </Link>
          <Link href={`/${params?.seller}/coupons/deleted`}>
            <Button className=" w-full gap-2 @lg:w-auto" variant="outline">
              <MdOutlineAutoDelete className="h-4 w-4" />
              Deleted
            </Button>
          </Link>
        </div>
      </PageHeader>

      {isLoading ? (
        <CouponLoadingPage />
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : data ? (
        <CouponsTable
          key={Math.random()}
          data={data}
          onDeleteItem={onDelete}
          temperoryDelete={temperoryDelete}
        />
      ) : (
        <CouponsTable
          key={Math.random()}
          data={coupons1}
          onDeleteItem={onDelete}
          temperoryDelete={temperoryDelete}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: 'auto',
          marginTop: '50px',
          width: '100%',
        }}
      >
        {pagininator && (
          <Pagination
            total={Number(pagininator?.itemCount)}
            pageSize={couponsPerPage}
            defaultCurrent={page}
            showLessItems={true}
            prevIconClassName="py-0 text-gray-500 !leading-[26px]"
            nextIconClassName="py-0 text-gray-500 !leading-[26px]"
            onChange={(e) => {
              setPage(e);
              paginate(e);
            }}
          />
        )}
      </div>
    </>
  );
}
