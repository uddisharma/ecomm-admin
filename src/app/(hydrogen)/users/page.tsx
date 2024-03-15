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
import UserTable from '@/component/users/user-list/table';
import { CiSearch } from 'react-icons/ci';

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
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
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
      </PageHeader>
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
