'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Title } from '@/component/ui/text';
import { Collapse } from '@/component/ui/collapse';
import cn from '@/utils/class-names';
import { PiCaretDownBold } from 'react-icons/pi';
import SimpleBar from '@/component/ui/simplebar';
import { menuItems } from './helium-menu-items';
import Image from 'next/image';
import { siteConfig } from '@/config/site.config';
import getStatusBadge from '@/component/others/get-status-badge';

export default function HeliumSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams();
  const sellerID = params?.seller;
  const isSellerDashboardHome = pathname?.includes(`${sellerID}/dashboard`);
  const isSellerDashboard = pathname?.includes(`${sellerID}`);
  const link = isSellerDashboardHome ? "/" : isSellerDashboard ? `/${sellerID}/dashboard` : "/";

  return (
    <aside
      className={cn(
        'fixed bottom-0 start-0 z-50 h-full w-[284px] xl:p-5 2xl:w-[308px] dark:bg-gray-100/50',
        className
      )}
    >
      <div className="h-full bg-gray-900 p-1.5 pl-0  pr-1.5 xl:rounded-2xl dark:bg-gray-100/70">
        <div className="sticky top-0 z-40 flex justify-center px-6 pb-5 pt-5 2xl:px-8 2xl:pt-6">
          <Link href={link} aria-label="Site Logo">
            <Image
              src="/logo-short-light.svg"
              alt={siteConfig.title}
              width={58}
              height={35}
              priority
            />
          </Link>
        </div>

        <SimpleBar className="h-[calc(100%-80px)]">
          <div className="mt-4 pb-3 3xl:mt-6">
            {menuItems.map((item, index) => {
              const isActive = pathname === (item?.href as string);

              return (
                <Fragment key={item.name + '-' + index}>
                  {item?.href ? (
                    <>
                      <Link
                        href={item?.href}
                        className={cn(
                          'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
                          isActive
                            ? 'before:top-2/5 text-white before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-white 2xl:before:-start-5 dark:text-gray-900'
                            : 'text-gray-300/70 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-700'
                        )}
                      >
                        <div className="flex items-center truncate">
                          {item?.icon && (
                            <span
                              className={cn(
                                'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-200 [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                isActive
                                  ? 'text-white dark:text-gray-900'
                                  : 'text-gray-300/70 group-hover:text-gray-500 dark:text-gray-500 '
                              )}
                            >
                              {item?.icon}
                            </span>
                          )}
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item?.badge?.length
                          ? getStatusBadge(item?.badge)
                          : null}
                      </Link>
                    </>
                  ) : (
                    <Title
                      as="h6"
                      className={cn(
                        'mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8 dark:text-gray-500',
                        index !== 0 && 'mt-6 3xl:mt-7'
                      )}
                    >
                      {item.name}
                    </Title>
                  )}
                </Fragment>
              );
            })}
          </div>
        </SimpleBar>
      </div>
    </aside>
  );
}
