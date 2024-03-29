'use client';
import CategoryTable from '@/component/ecommerce/category/category-list/table';
import CategoryPageHeader from './category-page-header';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  deleteCategory1,
  errorRetry,
  sellerCategoriesByAdmin,
} from '@/constants';
import { useParams } from 'next/navigation';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import CategoryLoadingPage from '@/component/loading/categoryLoading';
import { toast } from 'sonner';
import { fetcher } from '@/constants/fetcher';
import { useCookies } from 'react-cookie';
import { extractPathAndParams } from '@/utils/urlextractor';

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
  const params = useParams();

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${sellerCategoriesByAdmin}/${params?.seller}`,
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

  const deleteCategory = async (id: any) => {
    try {
      const res = await axios.delete(
        `${BaseApi}${deleteCategory1}/${params?.seller}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.admintoken}`,
          },
        }
      );
      if (res.data?.status == 'SUCCESS') {
        await mutate();
        toast.success('Category Deleted Success');
      } else {
        return toast.error('Something went wrong');
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
      return toast.error('Something went wrong');
    }
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
