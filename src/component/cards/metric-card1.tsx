'use client';

import { Title, Text } from '@/component/ui/text';
import cn from '@/utils/class-names';
import { useModal } from '../modal-views/use-modal';
import {
  PiShoppingCartDuotone,
  PiPackageDuotone,
  PiCreditCardDuotone,
  PiHouseLine,
  PiXBold,
} from 'react-icons/pi';
import { CiDeliveryTruck } from 'react-icons/ci';
import { AiFillPicture } from 'react-icons/ai';
import { TiTicket } from 'react-icons/ti';
import {
  MdOutlineCreateNewFolder,
  MdOutlineFileDownload,
} from 'react-icons/md';

const metricCardClasses = {
  base: 'border border-muted bg-gray-0 p-5 dark:bg-gray-50 lg:p-6',
  rounded: {
    sm: 'rounded-sm',
    DEFAULT: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
  },
};

type MetricCardTypes = {
  title: string;
  metric: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
  contentClassName?: string;
  chart?: React.ReactNode;
  info?: React.ReactNode;
  rounded?: keyof typeof metricCardClasses.rounded;
  titleClassName?: string;
  metricClassName?: string;
  chartClassName?: string;
  className?: string;
  seller: any;
  isActive: boolean;
  isOnboarded: boolean;
};

export default function MetricCard({
  title,
  metric,
  icon,
  chart,
  info,
  rounded = 'DEFAULT',
  className,
  iconClassName,
  contentClassName,
  titleClassName,
  metricClassName,
  chartClassName,
  children,
  seller,
  isActive,
  isOnboarded,
}: React.PropsWithChildren<MetricCardTypes>) {
  const { openModal } = useModal();
  return (
    <div
      className={cn(
        'cursor-pointer',
        metricCardClasses.base,
        metricCardClasses.rounded[rounded],
        className
      )}
      onClick={() => {
        openModal({
          view: <SellerOptions seller={seller} />,
          customSize: '1000px',
        });
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* {icon ? (
            <div
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 lg:h-12 lg:w-12',
                iconClassName
              )}
            >
              {icon}
            </div>
          ) : null} */}

          <div className={cn(icon && 'ps-3', contentClassName)}>
            <div className="gap-10px flex flex-row">
              <Text className={cn('mb-0.5 text-gray-500', titleClassName)}>
                {metric}
              </Text>
            </div>

            <div className="gap-10px mt-2 flex flex-row">
              <Text
                className={cn(
                  'font-lexend text-lg font-semibold text-gray-900 2xl:xl:text-xl dark:text-gray-700',
                  metricClassName
                )}
              >
                {title}
              </Text>
            </div>
            <div className="gap-10px mt-2 flex flex-row">
              {isActive ? (
                <Text
                  as="span"
                  className="relative ml-3  inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green"
                >
                  Open
                </Text>
              ) : (
                <Text
                  as="span"
                  className="relative ml-3  inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-red"
                >
                  Closed
                </Text>
              )}
              {isOnboarded ? (
                <Text
                  as="span"
                  className="relative ml-3  inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green"
                >
                  onboarded
                </Text>
              ) : (
                <Text
                  as="span"
                  className="relative ml-3  inline-block rounded-md border border-gray-200 py-1.5 pe-2.5 ps-5 text-xs font-semibold text-gray-900 before:absolute before:start-2.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-red"
                >
                  onboarding pending
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

import React from 'react';
import { ActionIcon, Button } from 'rizzui';

import Link from 'next/link';
import { RiCoupon2Line } from 'react-icons/ri';
import { FaRegUserCircle } from 'react-icons/fa';
import { TbDeviceDesktopAnalytics } from 'react-icons/tb';

const SellerOptions = ({ seller }: any) => {
  const { closeModal } = useModal();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <TbDeviceDesktopAnalytics />,
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: <PiPackageDuotone />,
    },
    {
      name: 'Products',
      href: '/products',
      icon: <PiShoppingCartDuotone />,
    },
    {
      name: 'Add Product',
      href: '/products/create',
      icon: <MdOutlineCreateNewFolder />,
      badge: '',
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: <PiCreditCardDuotone />,
    },
    {
      name: 'Add Category',
      href: '/categories/create',
      icon: <MdOutlineCreateNewFolder />,
      badge: '',
    },

    {
      name: 'Coupons',
      href: '/coupons',
      icon: <RiCoupon2Line />,
    },
    {
      name: 'Add Coupon',
      href: '/coupons/create',
      icon: <MdOutlineCreateNewFolder />,
      badge: '',
    },

    {
      name: 'Banners',
      href: '/banners',
      icon: <AiFillPicture />,
    },
    {
      name: 'Add Banner',
      href: '/banners/create',
      icon: <MdOutlineCreateNewFolder />,
      badge: '',
    },

    {
      name: 'Payouts',
      href: '/transactions',
      icon: <PiCreditCardDuotone />,
      badge: '',
    },
    {
      name: 'Logistics',
      href: '/logistics',
      icon: <CiDeliveryTruck />,
      badge: '',
    },
    {
      name: 'Tickets',
      href: '/tickets',
      icon: <TiTicket />,
      badge: '',
    },
    {
      name: 'Create Ticket',
      href: '/tickets/create',
      icon: <MdOutlineCreateNewFolder />,
      badge: '',
    },
    {
      name: 'Download Report',
      href: '/report',
      icon: <MdOutlineFileDownload />,
      badge: '',
    },
    {
      name: 'Profile',
      href: '/shop',
      icon: <FaRegUserCircle />,
      badge: '',
    },
  ];

  return (
    <div>
      <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            Seller Options
          </Title>
          <ActionIcon size="sm" variant="text" onClick={() => closeModal()}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>
        <div className="grid grid-cols-1 gap-6 @container md:grid-cols-2 lg:grid-cols-4 3xl:gap-8">
          {menuItems?.map((e: any, i: any) => (
            <Link key={i} href={`${seller}${e?.href}`}>
              <Button className="w-full" type="submit" size="lg">
                <span>{e?.name}</span>
                <div className="ms-2 mt-2 h-6 w-6">{e?.icon}</div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
