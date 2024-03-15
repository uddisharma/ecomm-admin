'use client';
import Link from 'next/link';
import { PiPlusBold, PiShoppingCartDuotone } from 'react-icons/pi';
import { Button } from '@/component/ui/button';
import PageHeader from '@/component/others/pageHeader';
import ProductsTable from '@/component/ecommerce/product/product-list/table';
import ExportButton from '@/component/others/export-button';
import ProductLoadingPage from '@/component/loading/products';
import Pagination from '@/component/ui/pagination';
import axios from 'axios';
import useSWR from 'swr';
import {
  BaseApi,
  ItemperPage,
  SellerProducts,
  deleteProduct,
  productsSoftDelete,
} from '@/constants';
import { useContext, useState } from 'react';
import { UserContext } from '@/store/user/context';
import { useFilterControls } from '@/hooks/use-filter-control';
import { Empty, SearchNotFoundIcon } from 'rizzui';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import DeletedProductsTable from '@/component/ecommerce/product/deleted/table';

const pageHeader = {
  title: 'Deleted Products',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/products',
      name: 'Products',
    },
    {
      name: 'List',
    },
  ],
};

export default function ProductsPage() {
  const params = useParams();
  const initialState = {
    page: '',
  };
  const { state: st, paginate } = useFilterControls<typeof initialState, any>(
    initialState
  );
  const [page, setPage] = useState(st?.page ? st?.page : 1);
  const { state } = useContext(UserContext);
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${SellerProducts}/${params?.seller}?page=${page}&limit=${ItemperPage}&isDeleted=${true}`,
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

  const onDelete = async (id: any) => {
    try {
      await axios.delete(`${BaseApi}${deleteProduct}/${id}`);
      await mutate();
      return toast.success('Product is Permanently Deleted Successfully !');
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const temperoryDelete = async (id: string) => {
    try {
      await axios.patch(`${BaseApi}${productsSoftDelete}/${id}`, {
        isDeleted: false,
      });
      await mutate();
      return toast.success('Product is Recycled Successfully !');
    } catch (error) {
      console.log(error);
      return toast.error('Something went wrong');
    }
  };

  const products: any = [];

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={data} fileName="product_data" header="" />
          <Link
            href={`/${params?.seller}/products/create`}
            className="w-full @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Product
            </Button>
          </Link>
          <Link
            href={`/${params?.seller}/products`}
            className="w-full @lg:w-auto"
          >
            <Button
              tag="span"
              className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiShoppingCartDuotone className="me-1.5 h-[17px] w-[17px]" />
              View All
            </Button>
          </Link>
        </div>
      </PageHeader>
      {isLoading ? (
        <ProductLoadingPage />
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<SearchNotFoundIcon />}
            text="Something Went Wrong !"
            className="h-full justify-center"
          />
        </div>
      ) : data ? (
        <DeletedProductsTable
          key={Math.random()}
          data={data}
          deleteProduct={onDelete}
          temperoryDelete={temperoryDelete}
        />
      ) : (
        <DeletedProductsTable
          key={Math.random()}
          data={products}
          deleteProduct={onDelete}
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
            pageSize={ItemperPage}
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
