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
  deleteReferral,
  getAllReferrals,
  referralsPerPage,
  updateReferral,
} from '@/constants';
import TransactionLoadingPage from '@/component/loading/transactions';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { MdOutlineAutoDelete } from 'react-icons/md';
import ReferralTable from '@/component/referrals/table';
import { LuScreenShare } from 'react-icons/lu';
import DeletedReferralTable from '@/component/referrals/deleted/table';
const metadata = {
  ...metaObject('Transactions'),
};

const pageHeader = {
  title: 'Referrals',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/referrals/all',
      name: 'Referrals',
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
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${getAllReferrals}?page=${page}&limit=${referralsPerPage}&isDeleted=${true}`,
    fetcher,
    {
      refreshInterval: 3600000,
    }
  );
  const pagininator = data?.data?.paginator;
  data = data?.data?.data;

  const onDelete = async (id: any) => {
    try {
      const res = await axios.patch(`${BaseApi}${updateReferral}/${id}`, {
        isDeleted: false,
      });
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Referral is Recycled Success');
      } else {
        return toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const updateOnboard = async (id: any, status: boolean) => {
    try {
      const res = await axios.patch(`${BaseApi}${updateReferral}/${id}`, {
        onboarded: status,
      });
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Onboarded Status Changed Successfully !');
      } else {
        return toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const updatePaid = async (id: any, status: boolean) => {
    try {
      const res = await axios.patch(`${BaseApi}${updateReferral}/${id}`, {
        status: status,
      });
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Paid Status Changed Successfully !');
      } else {
        return toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const permanentlydelete = async (id: string) => {
    try {
      const res = await axios.delete(`${BaseApi}${deleteReferral}/${id}`);
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Referral is Permanently Deleted Successfully !');
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
          <Link href={`/referrals/create`}>
            <Button
              tag="span"
              className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1 h-4 w-4" />
              Add Referrals
            </Button>
          </Link>
          <Link href={`/referrals/all`}>
            <Button
              tag="span"
              variant="outline"
              className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <LuScreenShare className="me-1 h-4 w-4" />
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
        <DeletedReferralTable
          onDeleteItem={onDelete}
          key={Math.random()}
          data={data}
          updatePaid={updatePaid}
          updateOnboard={updateOnboard}
          permanentlydelete={permanentlydelete}
        />
      )}
      {data == null && (
        <DeletedReferralTable
          onDeleteItem={onDelete}
          key={Math.random()}
          data={transactions}
          updatePaid={updatePaid}
          updateOnboard={updateOnboard}
          permanentlydelete={permanentlydelete}
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
            pageSize={referralsPerPage}
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
