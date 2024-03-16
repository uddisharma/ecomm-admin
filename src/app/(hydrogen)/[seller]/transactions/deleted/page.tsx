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
} from '@/constants';
import TransactionLoadingPage from '@/component/loading/transactions';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PiCreditCardDuotone, PiPlusBold } from 'react-icons/pi';
import DeletedTransactionsTable from '@/component/transactions/deleted/table';
const metadata = {
  ...metaObject('Transactions'),
};

const pageHeader = {
  title: 'Deleted Transactions',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/transactions',
      name: 'Transactions',
    },
    {
      name: 'List',
    },
  ],
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
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${sellerTransactions}/${params?.seller}?page=${page}&limit=${transactionPerPage}&isDeleted=${true}`,
    fetcher,
    {
      refreshInterval: 3600000,
    }
  );
  const pagininator = data?.data?.paginator;
  data = data?.data?.data;

  const onDelete = async (id: any) => {
    try {
      const res = await axios.delete(`${BaseApi}${deleteTransaction}/${id}`);
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Transaction is Permanently Deleted Successfully !');
      } else {
        return toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const temperoryDelete = async (id: string) => {
    try {
      const res = await axios.patch(
        `${BaseApi}${softDeleteTransaction}/${id}`,
        {
          isDeleted: false,
        }
      );
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Transaction is Recycled Successfully !');
      } else {
        return toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const transactions: any = [];
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="payout_data" header="" />
          <Link href={`/${params?.seller}/transactions/create`}>
            <Button
              tag="span"
              className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1 h-4 w-4" />
              Create Transaction
            </Button>
          </Link>
          <Link href={`/${params?.seller}/transactions`}>
            <Button
              tag="span"
              className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiCreditCardDuotone className="me-1 h-4 w-4" />
              View All
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
