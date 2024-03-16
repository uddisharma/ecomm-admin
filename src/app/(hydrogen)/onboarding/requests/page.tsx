'use client';
import SellerLoading from '@/component/loading/sellerLoading';
import OnboardingRequestTable from '@/component/onboarding/requests/table';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import Pagination from '@/component/ui/pagination';
import {
  BaseApi,
  deleteRequest,
  onboardingReqLimit,
  onboardingRequest,
} from '@/constants';
import { useFilterControls } from '@/hooks/use-filter-control';
import cn from '@/utils/class-names';
import axios from 'axios';
import React, { useState } from 'react';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import useSWR from 'swr';

const Page = () => {
  const pageHeader = {
    title: 'Onboarding Requests',
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

  const initialState = {
    page: '',
  };
  const { state, paginate } = useFilterControls(initialState);
  const [page, setPage] = useState(state?.page ? state?.page : 1);
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, error, isLoading, mutate } = useSWR(
    `${BaseApi}${onboardingRequest}?page=${page}&limit=${onboardingReqLimit}`,
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
      const res = await axios.delete(`${BaseApi}${deleteRequest}/${id}`);
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success(`Onboard Request Deleted Successfully`);
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };
  const onMark = async (id: string, status: boolean) => {
    try {
      const res = await axios.patch(`${BaseApi}${deleteRequest}/${id}`, {
        status: status,
      });
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success(
          `Marked as ${status ? 'Completed' : 'Pending'} Successfully`
        );
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const sellers: any = [];

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="product_data" header="" />
        </div>
      </PageHeader>

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
                <OnboardingRequestTable
                  onDelete={onDeleteItem}
                  onMark={onMark}
                  key={Math.random()}
                  data={data}
                />
              )}

              {data == null && (
                <OnboardingRequestTable
                  onDelete={onDeleteItem}
                  onMark={onMark}
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
              pageSize={onboardingReqLimit}
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
