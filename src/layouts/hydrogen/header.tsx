'use client';

import Link from 'next/link';
import HamburgerButton from '@/layouts/hamburger-button';
import SearchWidget from '@/component/search/search';
import Sidebar from '@/layouts/hydrogen/sidebar';
import cn from '@/utils/class-names';
import Logo from '@/component/others/logo';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useWindowScroll } from '@/hooks/use-window-scroll';
import HeaderMenuRight from '@/layouts/header-menu-right';
import Image from 'next/image';
import { siteConfig } from '@/config/site.config';

export default function Header() {
  const isMounted = useIsMounted();
  const windowScroll = useWindowScroll();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center bg-gray-0/80 px-4 py-4 backdrop-blur-xl md:px-5 lg:px-6 2xl:py-5 3xl:px-8 4xl:px-10 dark:bg-gray-50/50',
        ((isMounted && windowScroll.y) as number) > 2 ? 'card-shadow' : ''
      )}
    >
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={<Sidebar className="static w-full 2xl:w-full" />}
        />
        <div className="flex justify-center xl:hidden">
          <Link href={'/'}>
            <Image
              className="block w-full dark:hidden"
              src={siteConfig.logo}
              alt={siteConfig.title}
            />
            <Image
              className="hidden lg:w-full justify-center dark:block w-[150px]"
              src={siteConfig.logoWhite}
              alt={siteConfig.title}
            />
          </Link>
        </div>
        <div className="ml-3">
          <SearchWidget />
        </div>
      </div>

      <HeaderMenuRight />
    </header>
  );
}
