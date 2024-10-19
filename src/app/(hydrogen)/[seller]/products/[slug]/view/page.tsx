'use client';
import Link from 'next/link';
import { Metadata } from 'next';
import { PiPlusBold } from 'react-icons/pi';
import PageHeader from '@/component/others/pageHeader';
import { metaObject } from '@/config/site.config';
import { Button } from '@/component/ui/button';
import axios from 'axios';
import useSWR from 'swr';
import { BaseApi, errorRetry, singleProduct } from '@/constants';
import { Empty, EmptyProductBoxIcon } from 'rizzui';
import Spinner from '@/component/ui/spinner';
import ViewProduct from '@/component/ecommerce/product/view';
import { useCookies } from 'react-cookie';
import { fetcher } from '@/constants/fetcher';
import { toast } from 'sonner';
import { extractPathAndParams } from '@/utils/urlextractor';

type Props = {
  params: { slug: string; seller: string };
};

/**
 * for dynamic metadata
 * @link: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */

async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  return metaObject(`Edit ${slug}`);
}


export default function EditProductPage({
  params,
}: {
  params: { slug: string; seller: any };
}) {
  function generateInstagramPostLink(postId: any) {
    const instagramBaseUrl = 'https://www.instagram.com/p/';
    const fullPostLink = `${instagramBaseUrl}${postId}/`;
    return fullPostLink;
  }

  const [cookies] = useCookies(['admintoken']);

  let { data, isLoading, error, mutate } = useSWR(
    `${BaseApi}${singleProduct}/${params.slug}`,
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

  const product = {
    ...data?.data,
    instaId: generateInstagramPostLink(data?.data?.instaId),
    images: data?.data?.images,
    stock: data?.data?.stock?.toString(),
    category: `${data?.data?.category?.name} in ${data?.data?.category?.parentCategoryId?.parentCategoryId?.name} ${data?.data?.category?.parentCategoryId?.name} Wear`,
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

  const pageHeader = {
    title: 'Product Details',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `/${params?.seller}/dashboard`,
        name: 'Seller',
      },
      {
        name: 'Product Details',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={`/${params?.seller}/products/create`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:text-white "
            variant='outline'
          >
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Product
          </Button>
        </Link>
      </PageHeader>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<EmptyProductBoxIcon />}
            text="No Data Found !"
            className="h-full justify-center"
          />
        </div>
      ) : (
        product &&
        product?.name && <ViewProduct product={product} slug={params.slug} />
      )}
    </>
  );
}
