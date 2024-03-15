'use client';
import StatCards from '@/component/cards/stat-cards';
import SellerLoading from '@/component/loading/sellerLoading';
import OnboardingPendingTable from '@/component/onboarding/pending/table';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import TicketTable from '@/component/tickets/EventsTable';
import Pagination from '@/component/ui/pagination';
import {
  BaseApi,
  findPendingSellers,
  pendingOnboarding,
  pendingOnboardingLimit,
  updateAdminSeller,
} from '@/constants';
import { useFilterControls } from '@/hooks/use-filter-control';
import cn from '@/utils/class-names';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { Button, Empty, Input, SearchNotFoundIcon, Title } from 'rizzui';
import { toast } from 'sonner';
import useSWR from 'swr';

const Page = () => {
  const pageHeader = {
    title: 'Onboarding Pending Sellers',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/sellers',
        name: 'Sellers',
      },
      {
        name: 'List',
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
  let { data, error, isLoading, mutate } = useSWR(
    `${BaseApi}${pendingOnboarding}?page=${page}&limit=${pendingOnboardingLimit}`,
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

  const onDeleteItem = async (id: any) => {
    try {
      const res = await axios.patch(`${BaseApi}${updateAdminSeller}/${id}`, {
        isDeleted: true,
      });
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success(`Seller is Temperory Deleted Successfully`);
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const findSeller = () => {
    setLoading(true);
    axios
      .get(`${BaseApi}${findPendingSellers}?term=${term}`)
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

  const sellers: any = [];

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
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
            className="w-full gap-2 @lg:w-auto"
          >
            Search
          </Button>
        </div>
      </PageHeader>
      {searchedData && searchedData?.length > 0 ? (
        <OnboardingPendingTable
          onDelete={onDeleteItem}
          key={Math.random()}
          data={data}
        />
      ) : (
        <>
          {isLoading ? (
            <div className="mb-5 grid grid-cols-1 gap-6 @container 3xl:gap-8">
              <SectionBlock title={''}>
                <SellerLoading
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
                  <OnboardingPendingTable
                    onDelete={onDeleteItem}
                    key={Math.random()}
                    data={data}
                  />
                )}

                {data == null && (
                  <OnboardingPendingTable
                    onDelete={onDeleteItem}
                    key={Math.random()}
                    data={sellers}
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
                pageSize={pendingOnboardingLimit}
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
