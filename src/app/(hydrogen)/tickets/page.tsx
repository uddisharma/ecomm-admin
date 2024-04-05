'use client';
import TicketsLoadingPage from '@/component/loading/tickets';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import TicketTable from '@/component/admintickets/EventsTable';
import Pagination from '@/component/ui/pagination';
import {
  BaseApi,
  admintickets,
  errorRetry,
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
import { MdOutlineAutoDelete } from 'react-icons/md';
import { useCookies } from 'react-cookie';
import { fetcher } from '@/constants/fetcher';
import { extractPathAndParams } from '@/utils/urlextractor';

export default function BlankPage() {
  const initialState = {
    page: '',
  };
  const { state: st, paginate } = useFilterControls<typeof initialState, any>(
    initialState
  );
  const [page, setPage] = useState(st?.page ? st?.page : 1);

  const { state } = useContext(UserContext);

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${admintickets}?page=${page}&limit=${ticketPerPage}&isDeleted=${false}`,
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

  const downlaodableTickets = data?.map((e: any) => {
    return {
      Seller: e?.seller?.shopname,
      TicketType: e?.type,
      Subject: e?.subject,
      Description: e?.description,
      isResolved: e?.closed ? 'Yes' : 'No',
      CreatedAt: e?.createdAt?.slice(0, 10),
    };
  });

  const onDeleteItem = async (id: any) => {
    try {
      const res = await axios.patch(
        `${BaseApi}${updateTicket}/${id}`,
        {
          isDeleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      );

      if (res.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success(`Ticket is Temperory Deleted Successfully`);
      } else {
        return toast.error('Something went wrong !');
      }
    } catch (error: any) {
      if (error?.response?.data?.status == 'UNAUTHORIZED') {
        localStorage.removeItem('admin');
        const currentUrl = window.location.href;
        const path = extractPathAndParams(currentUrl);
        if (typeof window !== 'undefined') {
          location.href = `/auth/sign-in?ref=${path}`;
        }
        return toast.error('Session Expired');
      }
      console.log(error);
      return toast.error('Something went wrong !');
    }
  };

  const onMark = async (id: any, closed: any) => {
    try {
      await axios.patch(
        `${BaseApi}${markTicket}/${id}`,
        {
          closed: closed,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      );
      await mutate();
      return toast.success(
        `Ticket Marked as ${closed ? 'Resolved' : 'Active'}`
      );
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

  const tickets: any = [];

  const pageHeader = {
    title: `Tickets (${pagininator?.itemCount ?? 0})`,
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/',
        name: 'Tickets',
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
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={downlaodableTickets}
            fileName="tickets_data"
            header=""
          />
          <Link href={'/tickets/create'} className="w-full @lg:w-auto">
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Create Ticket
            </Button>
          </Link>
          <Link href={`/tickets/deleted`}>
            <Button className=" w-full gap-2 @lg:w-auto" variant="outline">
              <MdOutlineAutoDelete className="h-4 w-4" />
              Deleted
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
        <TicketTable
          onDeleteItem={onDeleteItem}
          onMark={onMark}
          key={Math.random()}
          data={data}
          user={state?.user?.id}
        />
      ) : (
        <TicketTable
          onDeleteItem={onDeleteItem}
          onMark={onMark}
          key={Math.random()}
          data={tickets}
          user={state?.user?.id}
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
