'use client';
import { Button } from '@/component/ui/button';
import PageHeader from '@/component/others/pageHeader';
import ExportButton from '@/component/others/export-button';
import ProductLoadingPage from '@/component/loading/products';
import Pagination from '@/component/ui/pagination';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  deleteUser,
  errorRetry,
  findUsers,
  temperoryDeleteUser,
  updateUser,
  userList,
  userPerPage,
} from '@/constants';
import { useEffect, useState } from 'react';
import { useFilterControls } from '@/hooks/use-filter-control';
import { Empty, Input, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import { CiSearch } from 'react-icons/ci';
import DeletedUsersTable from '@/component/users/user-list/deleted/table';
import { extractPathAndParams } from '@/utils/urlextractor';
import { fetcher } from '@/constants/fetcher';
import { useCookies } from 'react-cookie';

const pageHeader = {
  title: 'Deleted Users',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/users',
      name: 'Users',
    },
    {
      name: 'List',
    },
  ],
};

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState<any>([]);
  const [term, setTerm] = useState<string>('');
  const initialState = {
    page: '',
  };
  const { state: st, paginate } = useFilterControls<typeof initialState, any>(
    initialState
  );
  const [page, setPage] = useState(st?.page ? st?.page : 1);

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${userList}?page=${page}&limit=${userPerPage}&isDeleted=${true}`,
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

  const downlaodableList = data?.map((e: any) => {
    return {
      name: e?.name,
      email: e?.email,
      phone: e?.mobileNo,
      createdAt: e?.createdAt?.slice(0, 10),
      isDeleted: 'Yes',
    };
  });

  const findUser = () => {
    setLoading(true);
    axios
      .get(`${BaseApi}${findUsers}?term=${term}`, {
        headers: {
          Authorization: `Bearer ${cookies?.admintoken}`,
        },
      })
      .then((res) => {
        console.log(res?.data?.data);
        if (res?.data?.data) {
          setSearchedData(res?.data?.data);
        } else {
          toast.warning('User Not found');
        }
      })
      .catch((err) => {
        if (err?.response?.data?.status == 'UNAUTHORIZED') {
          localStorage.removeItem('admin');
          const currentUrl = window.location.href;
          const path = extractPathAndParams(currentUrl);
          if (typeof window !== 'undefined') {
            location.href = `/auth/sign-in?ref=${path}`;
          }
          return toast.error('Session Expired');
        }
        console.log(err);
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

  const onDelete = async (id: any) => {
    try {
      const res = await axios.delete(`${BaseApi}${deleteUser}/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies?.admintoken}`,
        },
      });
      if (res?.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success('User is Permanently Deleted Successfully !');
      } else {
        toast.error('Something went wrong !');
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
      return toast.error('Something went wrong');
    }
  };

  const temperoryDelete = async (id: any) => {
    try {
      const res = await axios.patch(
        `${BaseApi}${updateUser}/${id}`,
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
        toast.success('User is Recycled Successfully !');
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

  const users: any = [];

  const pageHeader = {
    title: `Deleted Users (${pagininator?.itemCount ?? 0})`,
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/',
        name: 'Deleted Users',
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
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={downlaodableList}
            fileName="deleted_user_data"
            header=""
          />
          <Input
            prefix={<CiSearch className="h-auto w-5" />}
            type="text"
            value={term}
            onChange={(e) => {
              setTerm(e.target?.value);
            }}
            placeholder="Search for Users..."
          />
          <Button
            isLoading={loading}
            disabled={!term}
            onClick={() => findUser()}
            className=" w-full gap-2 @lg:w-auto"
          >
            Search
          </Button>
        </div>
      </PageHeader>
      {isLoading ? (
        <ProductLoadingPage />
      ) : (
        error && (
          <div style={{ paddingBottom: '100px' }}>
            <Empty
              image={<SearchNotFoundIcon />}
              text="Something Went Wrong !"
              className="h-full justify-center"
            />
          </div>
        )
      )}

      {searchedData && searchedData?.length > 0 ? (
        <DeletedUsersTable
          key={Math.random()}
          data={searchedData}
          onDeleteItem={onDelete}
          temperoryDelete={temperoryDelete}
        />
      ) : (
        <>
          {data == null ? (
            <DeletedUsersTable
              key={Math.random()}
              data={users}
              onDeleteItem={onDelete}
              temperoryDelete={temperoryDelete}
            />
          ) : (
            data && (
              <DeletedUsersTable
                key={Math.random()}
                data={data}
                onDeleteItem={onDelete}
                temperoryDelete={temperoryDelete}
              />
            )
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
                pageSize={userPerPage}
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
    </>
  );
}
