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
import { BaseApi, coupons, couponsPerPage, deleteCoupon } from '@/constants';
import CouponsTable from '@/component/coupons/table';
import CouponLoadingPage from '@/component/loading/coupons';
import { toast } from 'sonner';
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
  const [page, setPage] = useState(st?.page ? st?.page : 1);
  const { state } = useContext(UserContext);
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${coupons}/${state?.user?.id}?page=${page}&limit=${couponsPerPage}`,
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
  const coupons1: any = [];
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="coupons_data" header="" />
          <Link href={'coupons/create'} className="w-full @lg:w-auto">
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Coupon
            </Button>
          </Link>
        </div>
      </PageHeader>
      {error && (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      )}
      {isLoading && <CouponLoadingPage />}
      {data && (
        <CouponsTable key={Math.random()} data={data} onDelete={onDelete} />
      )}
      {data == null && (
        <CouponsTable key={Math.random()} data={coupons1} onDelete={onDelete} />
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
