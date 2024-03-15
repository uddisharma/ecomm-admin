'use client';

import { Avatar } from '@/component/ui/avatar';
import { Button } from '@/component/ui/button';
import { Popover } from '@/component/ui/popover';
import { Title, Text } from '@/component/ui/text';
import { UserContext } from '@/store/user/context';
import cn from '@/utils/class-names';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';

const menuItems = [
  {
    name: 'My Profile',
    href: '/profile',
  },
];

function DropdownMenu() {
  const { setUser, state, logout: lgt } = useContext(UserContext);

  const [cookies, setCookie, removeCookie] = useCookies(['admintoken']);

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('admin');
    removeCookie('admintoken', { path: '/' });
    router.push('/auth/sign-in');
    toast.success('Succesfully Logout');
  };
  return (
    <div className="w-64 text-left rtl:text-right">
      <div className="flex items-center border-b border-gray-300 px-6 pb-5 pt-6">
        <Avatar
          src={
            state?.user != null
              ? state?.user?.profile
              : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
          }
          name={state?.user != null ? state?.user?.name : 'Admin Name'}
          color="invert"
        />
        <div className="ms-3">
          <Title as="h6" className="font-semibold">
            {state?.user != null ? state?.user?.name : 'Admin Name'}
          </Title>
          <Text className="text-xs text-gray-600">
            {state?.user != null ? state?.user?.email : 'admin@gmail.com'}
          </Text>
        </div>
      </div>
      <div className="grid px-3.5 py-3.5 font-medium text-gray-700">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-300 px-6 pb-6 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={() => {
            logout();
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function ProfileMenu({
  buttonClassName,
  avatarClassName,
}: {
  buttonClassName?: string;
  avatarClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { state } = useContext(UserContext);
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  const [cookies, setCookie] = useCookies(['admintoken']);
  const router = useRouter();
  useEffect(() => {
    const cookieValue = cookies.admintoken;
    const admin = state?.user?.name;
    if (!cookieValue || !admin) {
      router.push('/auth/sign-in');
    }
    // console.log(state?.user);
  }, []);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      content={() => <DropdownMenu />}
      shadow="sm"
      placement="bottom-end"
      className="z-50 p-0 dark:bg-gray-100 [&>svg]:dark:fill-gray-100"
    >
      <button
        className={cn(
          'w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10',
          buttonClassName
        )}
      >
        <Avatar
          src={
            state?.user != null
              ? state?.user?.profile
              : 'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
          }
          name={state?.user != null ? state?.user?.name : 'Admin Name'}
          color="invert"
          className={cn('!h-9 w-9 sm:!h-10 sm:w-10', avatarClassName)}
        />
        {/* <Avatar
          src={
            'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
          }
          name={'Shop Name'}
          color="invert"
          className={cn('!h-9 w-9 sm:!h-10 sm:w-10', avatarClassName)}
        /> */}
      </button>
    </Popover>
  );
}
