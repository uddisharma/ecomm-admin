'use client';
import Link from 'next/link';
import { Metadata } from 'next';
import { PiPlusBold } from 'react-icons/pi';
import PageHeader from '@/component/others/pageHeader';
import { metaObject } from '@/config/site.config';
import { Button } from '@/component/ui/button';
import { routes } from '@/config/routes';
import axios from 'axios';
import useSWR from 'swr';
import { BaseApi, singleProduct } from '@/constants';
import EditProduct from '@/component/ecommerce/product/edit';
import { Empty, EmptyProductBoxIcon, SearchNotFoundIcon } from 'rizzui';
import Spinner from '@/component/ui/spinner';

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

const pageHeader = {
  title: 'Edit Product',
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
      name: 'Edit',
    },
  ],
};

export default function EditProductPage({
  params,
}: {
  params: { slug: string; seller: string };
}) {
  function generateInstagramPostLink(postId: any) {
    const instagramBaseUrl = 'https://www.instagram.com/p/';
    const fullPostLink = `${instagramBaseUrl}${postId}/`;
    return fullPostLink;
  }

  const fetcher = (url: any) => axios.get(url).then((res) => res.data);

  let { data, error, isLoading } = useSWR(
    `${BaseApi}${singleProduct}/${params.slug}`,
    fetcher,
    {
      refreshInterval: 3600000,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );
  const product = {
    ...data?.data,
    instaId: generateInstagramPostLink(data?.data?.instaId),
    images: {
      name: data?.data?.name,
      size: 1024,
      url: data?.data?.images,
    },
    stock: data?.data?.stock?.toString(),
    category: `${data?.data?.category?.name} in ${data?.data?.category?.parentCategoryId?.parentCategoryId?.name} ${data?.data?.category?.parentCategoryId?.name} Wear`,
  };

  return (
    <>
      <br />
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={`/${params?.seller}/products/create`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            Add Product
          </Button>
        </Link>
      </PageHeader>
      {error && (
        <div style={{ paddingBottom: '100px' }}>
          <Empty
            image={<EmptyProductBoxIcon />}
            text="No Data Found !"
            className="h-full justify-center"
          />
        </div>
      )}
      {isLoading && <Spinner />}

      {product && product?.name && (
        <EditProduct product={product} slug={params.slug} />
      )}
    </>
  );
}
