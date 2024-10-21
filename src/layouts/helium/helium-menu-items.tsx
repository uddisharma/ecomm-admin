import {
  PiShoppingCartDuotone,
  PiPackageDuotone,
  PiCreditCardDuotone,
  PiHouseLine,
} from 'react-icons/pi';
import { CiDeliveryTruck, CiShop } from 'react-icons/ci';
import { TiTicket } from 'react-icons/ti';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { RiCoupon2Line } from 'react-icons/ri';
export const menuItems = [
  {
    name: 'Home',
    href: '/',
    icon: <PiHouseLine />,
  },

  {
    name: 'Orderssdf',
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
    name: 'Shop',
    href: '/shop/profile',
    icon: <CiShop />,
    badge: '',
  },
];
