'use client';
import React from 'react';
import PageHeader from '@/component/others/pageHeader';
import { Button } from '@/component/ui/button';
import { PiPlusBold } from 'react-icons/pi';
import Link from 'next/link';
import ExportButton from '@/component/others/export-button';
import { useParams } from 'next/navigation';
type PageHeaderTypes = {
  title: string;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
  data: any;
};
export default function CategoryPageHeader({
  title,
  breadcrumb,
  className,
  data,
}: PageHeaderTypes) {
  const params = useParams();
  const categories = data?.map((e: any) => {
    return {
      category: e?.category?.name,
      parentCategory:
        e?.category?.parentCategoryId?.parentCategoryId?.name == 'All'
          ? e?.category?.parentCategoryId?.name
          : `${e?.category?.parentCategoryId?.parentCategoryId?.name} ${e?.category?.parentCategoryId?.name} wear`,
      isActive: 'Yes',
    };
  });

  return (
    <>
      <PageHeader title={title} breadcrumb={breadcrumb} className={className}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={categories} fileName="category_data" header="" />
          <Link href={`/${params?.seller}/categories/create`}>
            <Button
              tag="span"
              className="mt-4 w-full cursor-pointer @lg:mt-0 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100"
            >
              <PiPlusBold className="me-1 h-4 w-4" />
              Add Category
            </Button>
          </Link>
        </div>
      </PageHeader>
    </>
  );
}
