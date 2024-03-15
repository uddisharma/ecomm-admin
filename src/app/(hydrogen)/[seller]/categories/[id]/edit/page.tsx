import { Button } from '@/component/ui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/component/others/pageHeader';
import CreateCategory from '@/component/ecommerce/category/create-category';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: 'Edit Category',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      href: routes.eCommerce.categories,
      name: 'Categories',
    },
    {
      name: 'Edit',
    },
  ],
};

export default function EditCategoryPage({ params }: any) {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.eCommerce.categories}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button tag="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <CreateCategory />
    </>
  );
}
