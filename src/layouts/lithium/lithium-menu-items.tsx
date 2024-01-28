import {
  PiShoppingCartDuotone,
  PiPackageDuotone,
  PiCreditCardDuotone,
  PiHouseLine,
} from 'react-icons/pi';
import { CiDeliveryTruck, CiShop } from 'react-icons/ci';
import { TiTicket } from 'react-icons/ti';
import {
  MdOutlineCreateNewFolder,
  MdOutlineFileDownload,
} from 'react-icons/md';
import { RiCoupon2Line } from 'react-icons/ri';

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
  // {
  //   id: '1',
  //   name: 'Home',
  //   type: 'link',
  //   hasdropdown: false,
  //   popoverContentClassName: 'flex flex-col',
  //   dropdownItems: [
  //     {
  //       name: 'Home',
  //       href: '/',
  //       icon: (
  //         <span>
  //           <PiHouseLine className="h-5 w-5" />
  //         </span>
  //       ),
  //     },
  //   ],
  // },
  {
    id: '2',
    name: 'Orders',
    type: 'link',
    hasdropdown: false,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'Orders',
        href: '/orders',
        icon: (
          <span>
            <PiPackageDuotone className="h-5 w-5" />
          </span>
        ),
      },
    ],
  },

  {
    id: '3',
    name: 'Products',
    type: 'link',
    hasdropdown: true,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'View All',
        href: '/products',
        icon: (
          <span>
            <PiShoppingCartDuotone className="h-5 w-5" />
          </span>
        ),
      },
      {
        name: 'Add New',
        href: '/products/create',
        icon: (
          <span>
            <MdOutlineCreateNewFolder className="h-5 w-5" />
          </span>
        ),
      },
    ],
  },
  {
    id: '4',
    name: 'Categories',
    type: 'link',
    hasdropdown: false,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'View All',
        href: '/categories',
        icon: (
          <span>
            <PiCreditCardDuotone className="h-5 w-5" />
          </span>
        ),
      },
      {
        name: 'Add New',
        href: '/categories/create',
        icon: (
          <span>
            <MdOutlineCreateNewFolder className="h-5 w-5" />
          </span>
        ),
      },
    ],
  },
  {
    id: '8',
    name: 'Coupons',
    type: 'collapse',
    hasdropdown: true,
    popoverContentClassName:
      'grid grid-cols-1 2xl:grid-cols-2 w-[220px] 2xl:w-[420px]  gap-x-1 p-3',
    dropdownItems: [
      {
        name: 'View All',
        icon: (
          <span>
            <RiCoupon2Line className="h-5 w-5" />
          </span>
        ),
        href: '/coupons',
      },
      {
        name: 'Add New',
        icon: (
          <span>
            <MdOutlineCreateNewFolder className="h-5 w-5" />
          </span>
        ),
        href: '/coupons/create',
      },
    ],
  },
  {
    id: '5',
    name: 'Payout',
    type: 'link',
    hasdropdown: false,
    popoverContentClassName: 'flex flex-col',
    dropdownItems: [
      {
        name: 'Transactions',
        href: '/transactions',
        icon: (
          <span>
            <PiCreditCardDuotone className="h-5 w-5" />
          </span>
        ),
      },
    ],
  },
  {
    id: '6',
    name: 'Logistics',
    type: 'collapse',
    hasdropdown: true,
    popoverContentClassName:
      'grid grid-cols-1 2xl:grid-cols-2 w-[220px] 2xl:w-[420px]  gap-x-1 p-3',
    dropdownItems: [
      {
        name: 'Logistics',
        icon: (
          <span>
            <CiDeliveryTruck className="h-5 w-5" />
          </span>
        ),
        href: '/logistics',
      },
    ],
  },
  {
    id: '7',
    name: 'Tickets',
    type: 'collapse',
    hasdropdown: true,
    popoverContentClassName:
      'grid grid-cols-1 2xl:grid-cols-2 w-[220px] 2xl:w-[420px]  gap-x-1 p-3',
    dropdownItems: [
      {
        name: 'View All',
        icon: (
          <span>
            <TiTicket className="h-5 w-5" />
          </span>
        ),
        href: '/tickets',
      },
      {
        name: 'Create New',
        icon: (
          <span>
            <MdOutlineCreateNewFolder className="h-5 w-5" />
          </span>
        ),
        href: '/tickets/create',
      },
    ],
  },
  {
    id: '9',
    name: 'Report',
    type: 'collapse',
    hasdropdown: true,
    popoverContentClassName:
      'grid grid-cols-1 2xl:grid-cols-2 w-[220px] 2xl:w-[420px]  gap-x-1 p-3',
    dropdownItems: [
      {
        name: 'Download Report',
        icon: (
          <span>
            <MdOutlineFileDownload className="h-5 w-5" />
          </span>
        ),
        href: '/report',
      },
    ],
  },
];
