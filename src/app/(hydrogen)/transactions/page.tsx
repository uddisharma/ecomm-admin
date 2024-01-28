'use client';
import PageHeader from '@/component/others/pageHeader';
import { productsData } from '@/data/products-data';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/component/others/export-button';
import TransactionTable from '@/component/transactions/table';
import Pagination from '@/component/ui/pagination';
import { useFilterControls } from '@/hooks/use-filter-control';
import { useContext, useState } from 'react';
import { UserContext } from '@/store/user/context';
import axios from 'axios';
import useSWR from 'swr';
import { BaseApi, sellerTransactions, transactionPerPage } from '@/constants';
import TransactionLoadingPage from '@/component/loading/transactions';
import { Empty, SearchNotFoundIcon } from 'rizzui';
const metadata = {
  ...metaObject('Transactions'),
};

const pageHeader = {
  title: 'Transactions',
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
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error } = useSWR(
    `${BaseApi}${sellerTransactions}/${state?.user?.id}?page=${page}&limit=${transactionPerPage}`,
    fetcher,
    {
      refreshInterval: 3600000,
    }
  );
  const pagininator = data?.data?.paginator;
  data = data?.data?.data;
  const transactions: any = [];
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="payout_data" header="" />
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
      {data && <TransactionTable key={Math.random()} data={data} />}
      {data == null && (
        <TransactionTable key={Math.random()} data={transactions} />
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
