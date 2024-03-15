'use client';
import CategoryTable from '@/component/ecommerce/category/category-list/table';
import CategoryPageHeader from './category-page-header';
import { useContext } from 'react';
import { UserContext } from '@/store/user/context';
import axios from 'axios';
import useSWR from 'swr';
import { BaseApi, deleteCategory1, sellerCategoriesByAdmin } from '@/constants';
import { useParams } from 'next/navigation';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import CategoryLoadingPage from '@/component/loading/categoryLoading';
import { toast } from 'sonner';

const pageHeader = {
  title: 'Categories',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/categories',
      name: 'Categories',
    },
    {
      name: 'List',
    },
  ],
};

export default function CategoriesPage() {
  const { state } = useContext(UserContext);
  const params = useParams();
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${sellerCategoriesByAdmin}/${params?.seller}`,
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

  const deleteCategory = async (id: any) => {
    try {
      const res = await axios.delete(
        `${BaseApi}${deleteCategory1}/${params?.seller}/${id}`
      );
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Category Deleted Success');
      } else {
        return toast.error('Something went wrong');
      }
    } catch (error) {
      return toast.error('Something went wrong');
    }
  };

  return (
    <>
      <CategoryPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
        data={data?.data?.sellingCategory}
      />
      {isLoading ? (
        <CategoryLoadingPage />
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : data ? (
        <CategoryTable
          deleteCategory={deleteCategory}
          data={data?.data?.sellingCategory}
        />
      ) : (
        <CategoryTable deleteCategory={deleteCategory} data={[]} />
      )}
    </>
  );
}
