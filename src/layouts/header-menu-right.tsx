import { ActionIcon } from '@/component/ui/action-icon';

import ProfileMenu from '@/layouts/profile-menu';
import SettingsButton from '@/component/settings/settings-button';
import { MdBlock } from 'react-icons/md';
import Link from 'next/link';
import { Tooltip } from 'rizzui';
import { useContext } from 'react';
import { UserContext } from '@/store/user/context';

export default function HeaderMenuRight() {
  const { state } = useContext(UserContext);
  const isActive = state?.user?.isActive;
  return (
    <div className="ms-auto grid shrink-0 grid-cols-4 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      {/* <MessagesDropdown>
        <ActionIcon
          aria-label="Messages"
          variant="text"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
        >
          <ChatSolidIcon className="h-[18px] w-auto" />
          <Badge
            renderAsDot
            color="success"
            enableOutlineRing
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
          />
        </ActionIcon>
      </MessagesDropdown> */}
      <div></div>

      {!isActive ? (
        <Tooltip
          size="sm"
          content={() => 'Account Disabled'}
          placement="bottom"
          color="invert"
          className="z-50 bg-red-600"
        >
          <Link href={`/shop/disable-account`}>
            <ActionIcon
              aria-label="Settings"
              variant="text"
              className={
                'relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100'
              }
            >
              <MdBlock className="h-[22px] w-auto animate-spin-slow border-none text-red-700" />
            </ActionIcon>
          </Link>
        </Tooltip>
      ) : (
        <div></div>
      )}

      {/* <NotificationDropdown>
        <ActionIcon
          aria-label="Notification"
          variant="text"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
        >
          <RingBellSolidIcon className="h-[18px] w-auto" />
          <Badge
            renderAsDot
            color="warning"
            enableOutlineRing
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
          />
        </ActionIcon>
      </NotificationDropdown> */}
      <SettingsButton />
      <ProfileMenu />
    </div>
  );
}
