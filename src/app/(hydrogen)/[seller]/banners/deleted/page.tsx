'use client';
import PageHeader from '@/component/others/pageHeader';
import ExportButton from '@/component/others/export-button';
import Pagination from '@/component/ui/pagination';
import Link from 'next/link';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import { useFilterControls } from '@/hooks/use-filter-control';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  bannerPerPage,
  banners,
  deleteBanner,
  softDeleteBanner,
} from '@/constants';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import BannerLoading from '@/component/loading/bannerLoading';
import { AiFillPicture } from 'react-icons/ai';
import Card3 from '@/component/banner/card2';

const pageHeader = {
  title: 'Banners',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/',
      name: 'Banners',
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

  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${banners}/${params?.seller}?page=${page}&limit=${bannerPerPage}&isDeleted=${true}`,
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
      await axios.delete(`${BaseApi}${deleteBanner}/${id}`);
      await mutate();
      return toast.success('Banner is Permanently Deleted Successfully !');
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };
  const onTemperoryDelete = async (id: string) => {
    try {
      await axios.patch(`${BaseApi}${softDeleteBanner}/${id}`, {
        isDeleted: false,
      });
      await mutate();
      return toast.success('Banner is Recycle Successfully !');
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="coupons_data" header="" />
          <Link
            href={`/${params?.seller}/banners/create`}
            className="w-full @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Banner
            </Button>
          </Link>
          <Link
            href={`/${params?.seller}/banners`}
            className="w-full @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <AiFillPicture className="me-1.5 h-[17px] w-[17px]" />
              View All
            </Button>
          </Link>
        </div>
      </PageHeader>
      {isLoading ? (
        [1, 2, 3, 4, 5]?.map((e) => (
          <div key={e} className="mt-4">
            <BannerLoading />
          </div>
        ))
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : data ? (
        data.map((e: any) => (
          <Card3
            data={e}
            onDelete={onDelete}
            onTemperoryDelete={onTemperoryDelete}
            key={e}
          />
        ))
      ) : (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="No Banner Found !"
            className="h-full justify-center"
          />
        </div>
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
            pageSize={bannerPerPage}
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
