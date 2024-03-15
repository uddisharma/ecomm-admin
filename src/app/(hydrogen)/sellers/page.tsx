'use client';
import StatCards from '@/component/cards/stat-cards';
import SellerLoading from '@/component/loading/sellerLoading';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import Pagination from '@/component/ui/pagination';
import {
  BaseApi,
  allsellers,
  findSingleSeller,
  sellerLimit,
} from '@/constants';
import { useFilterControls } from '@/hooks/use-filter-control';
import cn from '@/utils/class-names';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiMoneyCheck1, CiSearch } from 'react-icons/ci';
import { FiUserPlus } from 'react-icons/fi';
import { MdOutlineAutoDelete, MdOutlinePendingActions } from 'react-icons/md';
import { Button, Empty, Input, SearchNotFoundIcon, Title } from 'rizzui';
import { toast } from 'sonner';
import useSWR from 'swr';

const Page = () => {
  const pageHeader = {
    title: '',
    breadcrumb: [
      {
        href: '/',
        name: '',
      },
      {
        href: '/',
        name: '',
      },
      {
        name: '',
      },
    ],
  };
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);
  const [term, setTerm] = useState<string>('');
  const initialState = {
    page: '',
  };
  const { state, paginate } = useFilterControls(initialState);
  const [page, setPage] = useState(state?.page ? state?.page : 1);
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, error, isLoading } = useSWR(
    `${BaseApi}${allsellers}?page=${page}&limit=${sellerLimit}`,
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

  const findSeller = () => {
    setLoading(true);
    axios
      .get(`${BaseApi}${findSingleSeller}?term=${term}`)
      .then((res) => {
        if (res?.data?.data) {
          setSearchedData(res?.data?.data);
        } else {
          toast.warning('Seller Not found');
        }
      })
      .catch((err) => {
        console.log(err);
        return toast.error('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!term) {
      setSearchedData([]);
    }
  }, [term]);

  return (
    <div>
      <header className={cn('mb-3 @container xs:-mt-2 lg:mb-7')}>
        <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
          <div className="mt-4 flex items-center gap-3 @lg:mt-0">
            <Link href={`/seller/onboarding`}>
              <Button
                tag="span"
                variant="outline"
                className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
              >
                <FiUserPlus className="me-1 h-4 w-4" />
                Onboard New
              </Button>
            </Link>
            <Link href={`/onboarding/pending`}>
              <Button
                tag="span"
                variant="outline"
                className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
              >
                <MdOutlinePendingActions className="me-1 h-4 w-4" />
                Onboarding Pending
              </Button>
            </Link>
            <Link href={`/sellers/deleted`}>
              <Button
                tag="span"
                variant="outline"
                className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
              >
                <MdOutlineAutoDelete className="me-1 h-4 w-4" />
                Deleted
              </Button>
            </Link>
            <ExportButton data={data} fileName="product_data" header="" />
            <Input
              prefix={<CiSearch className="h-auto w-5" />}
              type="text"
              value={term}
              onChange={(e) => {
                setTerm(e.target?.value);
              }}
              placeholder="Search for Seller..."
            />
            <Button
              isLoading={loading}
              disabled={!term}
              onClick={() => findSeller()}
              className=" ml-0 w-full gap-2 @lg:w-auto"
            >
              Search
            </Button>
          </div>
        </div>
      </header>
      {searchedData && searchedData?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 @container 3xl:gap-8">
          <SectionBlock title={''}>
            <StatCards
              key={Math.random()}
              data={searchedData}
              className="@2xl:grid-cols-3 @6xl:grid-cols-4 4xl:gap-8"
            />
          </SectionBlock>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="mb-5 grid grid-cols-1 gap-6 @container 3xl:gap-8">
              <SectionBlock title={''}>
                <LoadingCard
                  key={Math.random()}
                  className="@2xl:grid-cols-3 @6xl:grid-cols-4 4xl:gap-8"
                />
              </SectionBlock>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 @container 3xl:gap-8">
              <SectionBlock title={''}>
                {error && (
                  <div style={{ paddingBottom: '100px' }}>
                    <Empty
                      image={<SearchNotFoundIcon />}
                      text="Something Went Wrong !"
                      className="h-full justify-center"
                    />
                  </div>
                )}

                {data && (
                  <StatCards
                    key={Math.random()}
                    data={data}
                    className="@2xl:grid-cols-3 @6xl:grid-cols-4 4xl:gap-8"
                  />
                )}
              </SectionBlock>
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
                pageSize={sellerLimit}
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
      )}
    </div>
  );
};

export default Page;

function SectionBlock({
  title,
  titleClassName,
  children,
  className,
}: React.PropsWithChildren<{
  title?: string;
  titleClassName?: string;
  className?: string;
}>) {
  return <section className={className}>{children}</section>;
}

function LoadingCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9', className)}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e: any) => (
        <SellerLoading key={e} />
      ))}
    </div>
  );
}
