'use client';
import ContactTable from '@/component/contacts/table';
import SellerLoading from '@/component/loading/sellerLoading';
import OnboardingPendingTable from '@/component/onboarding/pending/table';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import Pagination from '@/component/ui/pagination';
import {
  BaseApi,
  contacts,
  contactsPerPage,
  deleteContact,
  errorRetry,
} from '@/constants';
import { fetcher } from '@/constants/fetcher';
import { useFilterControls } from '@/hooks/use-filter-control';
import cn from '@/utils/class-names';
import { extractPathAndParams } from '@/utils/urlextractor';
import axios from 'axios';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import useSWR from 'swr';

const Page = () => {
  const pageHeader = {
    title: 'Contacts Us',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/contacts',
        name: 'Contacts',
      },
      {
        name: 'List',
      },
    ],
  };

  const [searchedData, _setSearchedData] = useState<any>([]);

  const initialState = {
    page: '',
  };
  const { state, paginate } = useFilterControls(initialState);
  const [page, setPage] = useState(state?.page ? state?.page : 1);

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${contacts}?page=${page}&limit=${contactsPerPage}`,
    (url) => fetcher(url, cookies.admintoken),
    {
      refreshInterval: 3600000,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      onErrorRetry({ retrycount }: any) {
        if (retrycount > errorRetry) {
          return false;
        }
      },
    }
  );

  const authstatus = error?.response?.data?.status == 'UNAUTHORIZED' && true;

  const pagininator = data?.data?.paginator;
  data = data?.data?.data;

  const downloadableList = data?.map((e: any) => {
    return {
      name: e?.name,
      email: e?.email,
      mobileNo: e?.phone,
      subject: e?.subject,
      message: e?.message,
      status: e?.status ? 'Yes' : 'No',
    };
  });

  const onDeleteItem = async (id: any) => {
    try {
      const res = await axios.delete(`${BaseApi}${deleteContact}/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies?.admintoken}`,
        },
      });
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success(`Contact Request Deleted Successfully`);
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.status == 'UNAUTHORIZED') {
        localStorage.removeItem('admin');
        const currentUrl = window.location.href;
        const path = extractPathAndParams(currentUrl);
        if (typeof window !== 'undefined') {
          location.href = `/auth/sign-in?ref=${path}`;
        }
        return toast.error('Session Expired');
      }
      return toast.error('Something went wrong');
    }
  };

  const onMark = async (id: string, status: boolean) => {
    try {
      const res = await axios.patch(
        `${BaseApi}${deleteContact}/${id}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      );
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success(
          `Marked as ${status ? 'Completed' : 'Pending'} Successfully`
        );
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.status == 'UNAUTHORIZED') {
        localStorage.removeItem('admin');
        const currentUrl = window.location.href;
        const path = extractPathAndParams(currentUrl);
        if (typeof window !== 'undefined') {
          location.href = `/auth/sign-in?ref=${path}`;
        }
        return toast.error('Session Expired');
      }
      return toast.error('Something went wrong');
    }
  };

  const sellers: any = [];

  if (authstatus) {
    localStorage.removeItem('admin');
    toast.error('Session Expired');
    const currentUrl = window.location.href;
    const path = extractPathAndParams(currentUrl);
    if (typeof window !== 'undefined') {
      location.href = `/auth/sign-in?ref=${path}`;
    }
  }

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={downloadableList}
            fileName="contact_data"
            header=""
          />
        </div>
      </PageHeader>
      {searchedData && searchedData?.length > 0 ? (
        <OnboardingPendingTable
          onDelete={onDeleteItem}
          DeleteItem={() => {}}
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
                {error ? (
                  <div style={{ paddingBottom: '100px' }}>
                    <Empty
                      image={<SearchNotFoundIcon />}
                      text="Something Went Wrong !"
                      className="h-full justify-center"
                    />
                  </div>
                ) : data ? (
                  <ContactTable
                    onDelete={onDeleteItem}
                    onMark={onMark}
                    key={Math.random()}
                    data={data}
                  />
                ) : (
                  <ContactTable
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
                pageSize={contactsPerPage}
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
