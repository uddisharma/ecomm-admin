import {
  PiShoppingCartDuotone,
  PiPackageDuotone,
  PiCreditCardDuotone,
  PiHouseLine,
} from 'react-icons/pi';
import { CiDeliveryTruck, CiShop, CiMoneyCheck1 } from 'react-icons/ci';
import { TiTicket } from 'react-icons/ti';
import {
  MdOutlineCreateNewFolder,
  MdOutlineFileDownload,
  MdOutlinePhotoLibrary,
  MdOutlineAddPhotoAlternate,
  MdConnectWithoutContact,
} from 'react-icons/md';
import { RiCoupon2Line, RiUserStarLine } from 'react-icons/ri';
import { FiUser, FiUserPlus } from 'react-icons/fi';
import { IoTicketOutline } from 'react-icons/io5';
import { LuScreenShare } from 'react-icons/lu';
import { VscGitPullRequestCreate } from 'react-icons/vsc';

export interface SubMenuItemType {
  name: string;
  description?: string;
  href: string;
}

export interface DropdownItemType {
  name: string;
  icon: JSX.Element;
  href?: string;
  description?: string;
  subMenuItems?: SubMenuItemType[];
}

export type menuType = 'link' | 'collapse' | 'enhance';

export interface MenuItemsType {
  id: string;
  name: string;
  type: menuType;
  hasdropdown: Boolean;
  popoverContentClassName?: string;
  dropdownItems?: DropdownItemType[];
}

export const menuItems: MenuItemsType[] = [
  {
    id: '2',
    name: 'Sellers',
    type: 'link',
    hasdropdown: false,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'Sellers',
        href: '/sellers',
        icon: <RiUserStarLine className="h-5 w-5" />,
      },
      {
        name: 'Requests',
        href: '/onboarding/requests',
        icon: <VscGitPullRequestCreate className="h-5 w-5" />,
      },
    ],
  },
  {
    id: '4',
    name: 'Users',
    type: 'link',
    hasdropdown: false,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'Users',
        href: '/users',
        icon: <FiUser className="h-5 w-5" />,
      },
    ],
  },
  {
    id: '5',
    name: 'Payouts',
    type: 'link',
    hasdropdown: true,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'View All',
        href: '/payouts/all',
        icon: <CiMoneyCheck1 className="h-5 w-5" />,
      },
      {
        name: 'Create Payout',
        href: '/payouts/create',
        icon: <MdOutlineCreateNewFolder className="h-5 w-5" />,
      },
    ],
  },
  {
    id: '6',
    name: 'Tickets',
    type: 'link',
    hasdropdown: true,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'View All',
        href: '/tickets',
        icon: <IoTicketOutline className="h-5 w-5" />,
      },
      {
        name: 'Create Ticket',
        href: '/tickets/create',
        icon: <MdOutlineCreateNewFolder className="h-5 w-5" />,
      },
    ],
  },
  {
    id: '7',
    name: 'Banners',
    type: 'link',
    hasdropdown: true,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'View All',
        href: '/banners',
        icon: <MdOutlinePhotoLibrary className="h-5 w-5" />,
      },
      {
        name: 'Add Banner',
        href: '/banners/create',
        icon: <MdOutlineAddPhotoAlternate className="h-5 w-5" />,
      },
    ],
  },
  {
    id: '8',
    name: 'Referrals',
    type: 'link',
    hasdropdown: true,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'View All',
        href: '/referrals/all',
        icon: <LuScreenShare className="h-5 w-5" />,
      },
      {
        name: 'Add Referral',
        href: '/referrals/create',
        icon: <MdOutlineCreateNewFolder className="h-5 w-5" />,
      },
    ],
  },
  {
    id: '9',
    name: 'Contacts',
    type: 'link',
    hasdropdown: false,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'Contacts',
        href: '/contacts',
        icon: <MdConnectWithoutContact className="h-5 w-5" />,
      },
    ],
  },
  {
    id: '10',
    name: 'Download Report',
    type: 'link',
    hasdropdown: false,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'Download Report',
        href: '/report',
        icon: <MdOutlineFileDownload className="h-5 w-5" />,
      },
    ],
  },
];