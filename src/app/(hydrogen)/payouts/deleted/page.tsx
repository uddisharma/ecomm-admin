'use client';
import PageHeader from '@/component/others/pageHeader';
import ExportButton from '@/component/others/export-button';
import Pagination from '@/component/ui/pagination';
import { useFilterControls } from '@/hooks/use-filter-control';
import { useContext, useState } from 'react';
import { UserContext } from '@/store/user/context';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  transactionPerPage,
  deleteTransaction,
  allTransactions,
  adminSoftDeleteTransactions,
} from '@/constants';
import TransactionLoadingPage from '@/component/loading/transactions';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import PayoutsTable from '@/component/payouts/table';
import { CiMoneyCheck1 } from 'react-icons/ci';
import DeletedPayoutsTable from '@/component/payouts/deleted/table';

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
  const { state } = useContext(UserContext);
  const params = useParams();
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${allTransactions}?page=${page}&limit=${transactionPerPage}&isDeleted=${true}`,
    fetcher,
    {
      refreshInterval: 3600000,
    }
  );
  const pagininator = data?.data?.paginator;
  data = data?.data?.data;
  // console.log(data)

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

  const temperoryDelete = async (id: any) => {
    try {
      const res = await axios.patch(
        `${BaseApi}${adminSoftDeleteTransactions}/${id}`,
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
          <Link href={`/payouts/create`}>
            <Button
              tag="span"
              className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1 h-4 w-4" />
              Create Transaction
            </Button>
          </Link>
          <Link href={`/payouts/all`}>
            <Button
              tag="span"
              className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <CiMoneyCheck1 className="me-1 h-4 w-4" />
              View All
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
      {isLoading && <TransactionLoadingPage />}
      {data && (
        <DeletedPayoutsTable
          onDeleteItem={onDelete}
          key={Math.random()}
          data={data}
          temperoryDelete={temperoryDelete}
        />
      )}
      {data == null && (
        <DeletedPayoutsTable
          onDeleteItem={onDelete}
          key={Math.random()}
          data={transactions}
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
