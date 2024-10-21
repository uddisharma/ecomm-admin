'use client';

import Link from 'next/link';
import { Badge } from '@/component/ui/badge';
import { ActionIcon } from '@/component/ui/action-icon';
import SearchWidget from '@/component/search/search';
import MessagesDropdown from '@/layouts/messages-dropdown';
import NotificationDropdown from '@/layouts/notification-dropdown';
import ProfileMenu from '@/layouts/profile-menu';
import SettingsButton from '@/component/settings/settings-button';
import HamburgerButton from '@/layouts/hamburger-button';
import Logo from '@/component/others/logo';
import { MdBlock } from 'react-icons/md';
import {
  PiBellSimpleRingingDuotone,
  PiChatsCircleDuotone,
  PiGearDuotone,
  PiMagnifyingGlassDuotone,
} from 'react-icons/pi';
import cn from '@/utils/class-names';
import { menuItems } from '@/layouts/lithium/lithium-menu-items';
import HeaderMenuLeft from '@/layouts/lithium/lithium-header-left-menu';
import { useContext, useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Sidebar from '@/layouts/hydrogen/sidebar';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useWindowScroll } from '@/hooks/use-window-scroll';
import { Tooltip } from 'rizzui';
import { UserContext } from '@/store/user/context';
import Image from 'next/image';
import { siteConfig } from '@/config/site.config';

function HeaderMenusLeft() {
  const pathname = usePathname();
  const [hoveredMenu, setHoveredMenu] = useState<string>('');

  useEffect(() => {
    setHoveredMenu('');
  }, [pathname]);

  return (
    <ul className="flex gap-8">
      {menuItems.map((menu) => (
        <HeaderMenuLeft
          hoveredMenu={hoveredMenu}
          onLeave={() => setHoveredMenu('')}
          onHover={() => setHoveredMenu(menu.id)}
          key={menu.name + '-' + menu.id}
          menu={menu}
        />
      ))}
    </ul>
  );
}

function HeaderMenuRight() {
  const { state } = useContext(UserContext);
  const isActive = state?.user?.isActive;
  return (
    <div className="ms-auto flex shrink-0 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      {/* <MessagesDropdown>
        <ActionIcon
          aria-label="Messages"
          variant="text"
          className={cn(
            ' relative h-[34px] w-[34px] overflow-hidden rounded-full md:h-9 md:w-9 3xl:h-10 3xl:w-10 '
          )}
        >
          <PiChatsCircleDuotone className="h-6 w-auto" />
          <Badge
            renderAsDot
            color="success"
            enableOutlineRing
            className="absolute right-1 top-2.5 -translate-x-1 -translate-y-1/4"
          />
        </ActionIcon>
      </MessagesDropdown>
      */}
      {/* <NotificationDropdown>
        <ActionIcon
          aria-label="Notification"
          variant="text"
          className={cn(
            'relative h-[34px] w-[34px] overflow-hidden rounded-full md:h-9 md:w-9 3xl:h-10 3xl:w-10'
          )}
        >
          <PiBellSimpleRingingDuotone className="h-6 w-auto" />
          <Badge
            renderAsDot
            color="warning"
            enableOutlineRing
            className="absolute right-1 top-2.5 -translate-x-1 -translate-y-1/4"
          />
        </ActionIcon>
      </NotificationDropdown> */}
      {/* {!isActive && (
        <Tooltip
          size="sm"
          content={() => 'Account Disabled'}
          placement="bottom"
          color="invert"
          className="z-50 border border-none bg-red-600"
        >
          <Link href={`/shop/disable-account`}>
            <ActionIcon
              tag="span"
              size="sm"
              variant="outline"
              className="border border-none hover:text-gray-700"
            >
              <MdBlock className="h-[22px] w-auto animate-spin-slow border border-none text-red-700" />
            </ActionIcon>
          </Link>
        </Tooltip>
      )} */}
      <SettingsButton className="rounded-full text-gray-700 shadow-none backdrop-blur-none hover:text-gray-1000 3xl:h-10 3xl:w-10 dark:bg-gray-100/0">
        <PiGearDuotone className="h-[22px] w-auto animate-spin-slow" />
      </SettingsButton>

      <ProfileMenu
        buttonClassName="w-auto sm:w-auto p-1 border border-gray-300"
        avatarClassName="!w-7 !h-7 sm:!h-8 sm:!w-8"
      />
    </div>
  );
}

export default function Header() {
  const isMounted = useIsMounted();
  const windowScroll = useWindowScroll();
  const pathname = usePathname();
  const params = useParams();
  const sellerID = params?.seller;
  const isSellerDashboardHome = pathname?.includes(`${sellerID}/dashboard`);
  const isSellerDashboard = pathname?.includes(`${sellerID}`);
  const link = isSellerDashboardHome ? "/" : isSellerDashboard ? `/${sellerID}/dashboard` : "/";

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between bg-gray-0/80 px-4 py-4 backdrop-blur-xl md:px-5 lg:px-6 2xl:py-5 2xl:pl-6 3xl:px-8 dark:bg-gray-50/50',
        ((isMounted && windowScroll.y) as number) > 2 ? 'card-shadow' : ''
      )}
    >
      <div className="hidden items-center gap-3 xl:flex">
        <Link
          aria-label="Site Logo"
          href={link}
          className="me-4 hidden w-[155px] shrink-0 text-gray-900 lg:me-5 xl:block"
        >
          <Logo className="max-w-[155px]" />
        </Link>
        <HeaderMenusLeft />
      </div>
      <div className="flex w-full items-center gap-5 xl:w-auto 3xl:gap-6">
        <div className="flex w-full max-w-2xl items-center xl:w-auto">
          <HamburgerButton
            view={<Sidebar className="static w-full 2xl:w-full" />}
          />
          <Link className="xl:hidden" href={link}>
            <Image
              className="block w-[120px] dark:hidden"
              src={siteConfig.logo}
              alt={siteConfig.title}
            />
            <Image
              className="hidden w-[120px] justify-center dark:block"
              src={siteConfig.logoWhite}
              alt={siteConfig.title}
            />
          </Link>
          <div className="ml-3">
            <SearchWidget
              icon={<PiMagnifyingGlassDuotone className="h-[20px] w-[20px]" />}
              className={cn(
                'text-gray-700 hover:text-gray-900 focus-visible:outline-0 active:translate-y-0 xl:border-0 xl:p-0 xl:shadow-none xl:backdrop-blur-none xl:hover:border-0 xl:hover:outline-0 xl:focus:outline-0 xl:focus-visible:outline-0 [&_.magnifying-glass]:me-0 [&_.placeholder-text]:hidden [&_.search-command]:ms-2 [&_.search-command]:hidden [&_.search-command]:lg:text-gray-0'
              )}
            />
          </div>
        </div>
        <HeaderMenuRight />
      </div>
    </header>
  );
}
