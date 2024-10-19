'use client';
import StatCards from '@/component/cards/stat-cards';
import SellerLoading from '@/component/loading/sellerLoading';
import { useModal } from '@/component/modal-views/use-modal';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import Pagination from '@/component/ui/pagination';
import {
  BaseApi,
  allsellers,
  errorRetry,
  findSingleSeller,
  sellerLimit,
} from '@/constants';
import { fetcher } from '@/constants/fetcher';
import { useFilterControls } from '@/hooks/use-filter-control';
import cn from '@/utils/class-names';
import { extractPathAndParams } from '@/utils/urlextractor';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CiSearch } from 'react-icons/ci';
import { FiMoreHorizontal, FiUserPlus } from 'react-icons/fi';
import { MdOutlineAutoDelete, MdOutlinePendingActions } from 'react-icons/md';
import { Button, Empty, Input, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import useSWR from 'swr';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);
  const [term, setTerm] = useState<string>('');
  const initialState = {
    page: '',
  };
  const { state, paginate } = useFilterControls(initialState);
  const [page, setPage] = useState(state?.page ? state?.page : 1);

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error } = useSWR(
    `${BaseApi}${allsellers}?page=${page}&limit=${sellerLimit}`,
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

  const downlaoadablelist = data?.map((e: any) => {
    return {
      ShopName: e?.shopname,
      Username: e?.username,
      Email: e?.email,
      MobileNo: e?.mobileNo,
      MobileNo2: e?.alternatemobileNo,
      ShopAddress: `${e?.shopaddress?.address1} ${e?.shopaddress?.address2} ${e?.shopaddress?.city} ${e?.shopaddress?.landmark} ${e?.shopaddress?.pincode} ${e?.shopaddress?.state}`,
      isActive: e?.isActive ? 'Yes' : 'No',
      isDeleted: e?.isDeleted ? 'Yes' : 'No',
      isOnboarded: e?.isOnboarded ? 'Yes' : 'No',
    };
  });

  const findSeller = () => {
    setLoading(true);
    axios
      .get(`${BaseApi}${findSingleSeller}?term=${term}`, {
        headers: {
          Authorization: `Bearer ${cookies?.admintoken}`,
        },
      })
      .then((res) => {
        if (res?.data?.data) {
          setSearchedData(res?.data?.data);
        } else {
          toast.warning('Seller Not found');
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.status == 'UNAUTHORIZED') {
          localStorage.removeItem('admin');
          const currentUrl = window.location.href;
          const path = extractPathAndParams(currentUrl);
          if (typeof window !== 'undefined') {
            location.href = `/auth/sign-in?ref=${path}`;
          }
          return toast.error('Session Expired');
        }
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

  const pageHeader = {
    title: `Sellers (${pagininator?.itemCount ?? 0})`,
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/',
        name: 'Sellers',
      },
      {
        name: 'List',
      },
    ],
  };

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
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}> </PageHeader>

      <Header pagininator={pagininator} downlaoadablelist={downlaoadablelist} term={term} setTerm={setTerm} findSeller={findSeller} loading={loading} />

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
                {error ? (
                  <div style={{ paddingBottom: '100px' }}>
                    <Empty
                      image={<SearchNotFoundIcon />}
                      text="Something Went Wrong !"
                      className="h-full justify-center"
                    />
                  </div>
                ) : (
                  data && (
                    <StatCards
                      key={Math.random()}
                      data={data}
                      className="@2xl:grid-cols-3 @6xl:grid-cols-4 4xl:gap-8"
                    />
                  )
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

const Header = ({  downlaoadablelist, term, setTerm, findSeller, loading }: any) => {
  const { openModal } = useModal();

  const handleMoreOptionsClick = () => {
    openModal({
      view: (
        <div className="p-4">
          <Link href={`/seller/onboarding`}>
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <FiUserPlus className="me-1 h-4 w-4" />
              Onboard New
            </Button>
          </Link>
          <Link href={`/onboarding/pending`}>
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <MdOutlinePendingActions className="me-1 h-4 w-4" />
              Onboarding Pending
            </Button>
          </Link>
          <Link href={`/sellers/deleted`}>
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <MdOutlineAutoDelete className="me-1 h-4 w-4" />
              Deleted
            </Button>
          </Link>
          <ExportButton
            data={downlaoadablelist}
            fileName="sellers_data"
            header=""
            className="mt-4 w-full"
          />
        </div>
      ),
      customSize: '1000px',
    });
  };

  return (
    <header className={cn('mb-3 container xs:mt-2 lg:mb-7')}>
      <div className="hidden lg:flex">
        <div className="mt-4 flex items-center gap-3 lg:mt-0">
          <Link href={`/seller/onboarding`}>
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer lg:mt-0 lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <FiUserPlus className="me-1 h-4 w-4" />
              Onboard New
            </Button>
          </Link>
          <Link href={`/onboarding/pending`}>
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer lg:mt-0 lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <MdOutlinePendingActions className="me-1 h-4 w-4" />
              Onboarding Pending
            </Button>
          </Link>
          <Link href={`/sellers/deleted`}>
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer lg:mt-0 lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <MdOutlineAutoDelete className="me-1 h-4 w-4" />
              Deleted
            </Button>
          </Link>
          <ExportButton
            data={downlaoadablelist}
            fileName="sellers_data"
            header=""
            className="mt-4 w-full lg:mt-0 lg:w-auto"
          />
        </div>
      </div>
      <div className='mt-[-10px] mb-5 lg:mb-0 lg:mt-4 lg:flex items-center lg:gap-3 grid grid-cols-1'>
        <Button
          onClick={() => handleMoreOptionsClick()}
          className="mt-4 w-full lg:w-auto lg:mt-0 lg:hidden"
        >
          More Options <FiMoreHorizontal className="ml-1 mt-0" />
        </Button>
        <Input
          prefix={<CiSearch className="h-auto w-full" />}
          type="text"
          value={term}
          onChange={(e) => {
            setTerm(e.target?.value);
          }}
          placeholder="Search for Seller..."
          className="mt-4 flex-grow lg:mt-0 lg:w-auto"
        />
        <Button
          isLoading={loading}
          disabled={!term}
          onClick={() => findSeller()}
          className="mt-4 w-full lg:w-auto lg:mt-0"
        >
          Search
        </Button>

      </div>
    </header>
  );
};




