'use client';
import TicketsLoadingPage from '@/component/loading/tickets';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import Pagination from '@/component/ui/pagination';
import {
  BaseApi,
  admintickets,
  deleteTicket,
  markTicket,
  ticketPerPage,
  updateTicket,
} from '@/constants';
import { useFilterControls } from '@/hooks/use-filter-control';
import axios from 'axios';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { PiPlusBold } from 'react-icons/pi';
import { Button, Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import useSWR from 'swr';
import { UserContext } from '@/store/user/context';
import { IoTicketOutline } from 'react-icons/io5';
import DeletedTicketTable from '@/component/admintickets/deleted/EventsTable';

const pageHeader = {
  title: 'Deleted Tickets',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/tickets',
      name: 'Tickets',
    },
    {
      name: 'List',
    },
  ],
};

export default function BlankPage() {
  const initialState = {
    page: '',
  };
  const { state: st, paginate } = useFilterControls<typeof initialState, any>(
    initialState
  );
  const [page, setPage] = useState(st?.page ? st?.page : 1);

  const { state } = useContext(UserContext);

  const fetcher = (url: any) => axios.get(url).then((res) => res.data);

  let { data, error, isLoading, mutate } = useSWR(
    `${BaseApi}${admintickets}?page=${page}&limit=${ticketPerPage}&isDeleted=${true}`,
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
      const res = await axios.delete(`${BaseApi}${deleteTicket}/${id}`);

      if (res.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success(`Ticket is Deleted Successfully`);
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };
  const onMark = async (id: any, closed: any) => {
    try {
      await axios.patch(`${BaseApi}${markTicket}/${id}`, {
        closed: closed,
      });
      await mutate();
      return toast.success(
        `Ticket Marked as ${closed ? 'Resolved' : 'Active'}`
      );
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const onTemperoryDelete = async (id: string) => {
    try {
      await axios.patch(`${BaseApi}${updateTicket}/${id}`, {
        isDeleted: false,
      });
      await mutate();
      return toast.success('Ticket is Recycle Successfully !');
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const tickets: any = [];

  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="tickets_data" header="" />
          <Link href={'/tickets/create'} className="w-full @lg:w-auto">
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Create Ticket
            </Button>
          </Link>
          <Link href={'/tickets'} className="w-full @lg:w-auto">
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <IoTicketOutline className="me-1.5 h-[17px] w-[17px]" />
              View All
            </Button>
          </Link>
        </div>
      </PageHeader>
      {isLoading ? (
        <TicketsLoadingPage />
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : data ? (
        <DeletedTicketTable
          onDeleteItem={onDeleteItem}
          onMark={onMark}
          key={Math.random()}
          data={data}
          user={state?.user?.id}
          onTemperoryDelete={onTemperoryDelete}
        />
      ) : (
        <DeletedTicketTable
          onDeleteItem={onDeleteItem}
          onMark={onMark}
          key={Math.random()}
          data={tickets}
          user={state?.user?.id}
          onTemperoryDelete={onTemperoryDelete}
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
            pageSize={ticketPerPage}
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
