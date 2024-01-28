import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';

// Note: do not add href in the label object, it is rendering as label
export const pageLinks = [
  // label start
  {
    name: 'Home',
  },
  // label end

  {
    name: 'Home',
    href: '/',
  },

  {
    name: 'Orders',
    href: '/orders',
  },
  {
    name: 'Products',
    href: '/products',
  },
  {
    name: 'Add Product',
    href: '/products/create',
  },
  {
    name: 'Categories',
  },
  {
    name: 'Add Category',
    href: '/categories/create',
  },

  {
    name: 'Payouts',
    href: '/transaction',
  },
  {
    name: 'Logistics',
    href: '/logistics',
  },
  {
    name: 'Tickets',
    href: '/tickets',
  },
  {
    name: 'Create Ticket',
    href: '/tickets/create',
  },
  {
    name: 'Shop',
    href: '/shop',
  },
];
