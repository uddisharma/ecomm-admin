'use client';
import Link from 'next/link';
import PageHeader from '@/component/others/pageHeader';
import { Button } from '@/component/ui/button';
import CreateEditProduct1 from '@/component/ecommerce/product/create-edit';
import { useParams } from 'next/navigation';

const pageHeader = {
  title: 'Create Product',
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
      name: 'Create',
    },
  ],
};

export default function CreateProductPage() {
  const params = useParams();
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={`/${params?.seller}/products`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button
            tag="span"
            className="w-full @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
          >
            View all Products
          </Button>
        </Link>
      </PageHeader>

      <CreateEditProduct1 />
    </>
  );
}
