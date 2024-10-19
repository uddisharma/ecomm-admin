'use client';
import PageHeader from '@/component/others/pageHeader';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/component/others/export-button';
import Pagination from '@/component/ui/pagination';
import { useFilterControls } from '@/hooks/use-filter-control';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  sellerTransactions,
  transactionPerPage,
  deleteTransaction,
  softDeleteTransaction,
  errorRetry,
} from '@/constants';
import TransactionLoadingPage from '@/component/loading/transactions';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PiCreditCardDuotone, PiPlusBold } from 'react-icons/pi';
import DeletedTransactionsTable from '@/component/transactions/deleted/table';
import { fetcher } from '@/constants/fetcher';
import { useCookies } from 'react-cookie';
import { extractPathAndParams } from '@/utils/urlextractor';
const metadata = {
  ...metaObject('Transactions'),
};

export default function Transactions() {
  const initialState = {
    page: '',
  };
  const { state: st, paginate } = useFilterControls<typeof initialState, any>(
    initialState
  );
  const [page, setPage] = useState(st?.page ? st?.page : 1);

  const params = useParams();
  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${sellerTransactions}/${params?.seller}?page=${page}&limit=${transactionPerPage}&isDeleted=${true}`,
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

  const downloadblepayouts = data?.map((e: any) => {
    return {
      TransactionId: e?.transactionId,
      Amount: e?.amount,
      FromDate: e?.from?.slice(0, 10),
      ToDate: e?.to?.slice(0, 10),
      Paid: 'Not Sure',
    };
  });

  const onDelete = async (id: any) => {
    try {
      const res = await axios.delete(`${BaseApi}${deleteTransaction}/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies?.admintoken}`,
        },
      });
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Transaction is Permanently Deleted Successfully !');
      } else {
        return toast.error('Something went wrong');
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

  const temperoryDelete = async (id: string) => {
    try {
      const res = await axios.patch(
        `${BaseApi}${softDeleteTransaction}/${id}`,
        {
          isDeleted: false,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      );
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Transaction is Recycled Successfully !');
      } else {
        return toast.error('Something went wrong');
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

  const transactions: any = [];

  const pageHeader = {
    title: `Deleted Payouts (${pagininator?.itemCount ?? 0})`,
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/${params?.seller}/dashboard`,
        name: 'Seller',
      },
      {
        name: 'Deleted Payouts',
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
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={downloadblepayouts}
            fileName="payout_data"
            header=""
          />
          <Link href={`/${params?.seller}/transactions/create`}>
            <Button
              tag="span"
              className=" w-full cursor-pointer @lg:mt-0 @lg:w-auto"
              variant='outline'
            >
              <PiPlusBold className="me-1 h-4 w-4" />
              Create
            </Button>
          </Link>
          <Link href={`/${params?.seller}/transactions`}>
            <Button className=" w-full gap-2 @lg:w-auto" variant="outline">
              <PiCreditCardDuotone className="h-4 w-4" />
              All
            </Button>
          </Link>
        </div>
      </PageHeader>

      {isLoading ? (
        <TransactionLoadingPage />
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : data ? (
        <DeletedTransactionsTable
          temperoryDelete={temperoryDelete}
          onDelete={onDelete}
          key={Math.random()}
          data={data}
        />
      ) : (
        <DeletedTransactionsTable
          onDelete={onDelete}
          temperoryDelete={temperoryDelete}
          key={Math.random()}
          data={transactions}
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
            pageSize={transactionPerPage}
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
