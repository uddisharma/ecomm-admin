'use client';
import { Button } from '@/component/ui/button';
import ExportButton from '@/component/others/export-button';
import ProductLoadingPage from '@/component/loading/products';
import Pagination from '@/component/ui/pagination';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  findUsers,
  updateUser,
  userList,
  userPerPage,
} from '@/constants';
import { useEffect, useState } from 'react';
import { useFilterControls } from '@/hooks/use-filter-control';
import { Empty, Input, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import UserTable from '@/component/users/user-list/table';
import { CiSearch } from 'react-icons/ci';
import cn from '@/utils/class-names';
import Link from 'next/link';
import { MdOutlineAutoDelete } from 'react-icons/md';
import { FiUserPlus } from 'react-icons/fi';

const pageHeader = {
  title: 'Users',
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
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${userList}?page=${page}&limit=${userPerPage}&isDeleted=${false}`,
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

  const findUser = () => {
    setLoading(true);
    axios
      .get(`${BaseApi}${findUsers}?term=${term}`)
      .then((res) => {
        if (res?.data?.data) {
          setSearchedData(res?.data?.data);
        } else {
          toast.warning('User Not found');
        }
      })
      .catch((err) => {
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
      const res = await axios.patch(`${BaseApi}${updateUser}/${id}`, {
        isDeleted: true,
      });
      if (res?.data?.status == 'SUCCESS') {
        await mutate();
        return toast.success('User is Temperory Deleted Successfully !');
      } else {
        toast.error('Something went wrong !');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const users: any = [];
  return (
    <>
      <header className={cn('mb-3 @container xs:-mt-2 lg:mb-7')}>
        <div className="flex flex-col @lg:flex-row @lg:items-end @lg:justify-between">
          <div className="mt-4 flex items-center gap-3 @lg:mt-0">
            <Link href={`/users/create`}>
              <Button
                tag="span"
                variant="outline"
                className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
              >
                <FiUserPlus className="me-1 h-4 w-4" />
                New User
              </Button>
            </Link>

            <Link href={`/users/deleted`}>
              <Button
                tag="span"
                variant="outline"
                className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
              >
                <MdOutlineAutoDelete className="me-1 h-4 w-4" />
                Deleted
              </Button>
            </Link>
            <ExportButton data={data} fileName="product_data" header="" />
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
              className="w-full gap-2 @lg:w-auto"
            >
              Search
            </Button>
          </div>
        </div>
      </header>
      {isLoading && <ProductLoadingPage />}
      {error && (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      )}

      {searchedData && searchedData?.length > 0 ? (
        <UserTable
          key={Math.random()}
          data={searchedData}
          onDeleteItem={onDelete}
        />
      ) : (
        <>
          {data == null && (
            <UserTable
              key={Math.random()}
              data={users}
              onDeleteItem={onDelete}
            />
          )}
          {data && (
            <UserTable
              key={Math.random()}
              data={data}
              onDeleteItem={onDelete}
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
