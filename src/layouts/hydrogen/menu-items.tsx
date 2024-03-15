import { PiHouseLine } from 'react-icons/pi';
import { CiMoneyCheck1 } from 'react-icons/ci';
import { LuScreenShare } from 'react-icons/lu';
import { VscGitPullRequestCreate } from 'react-icons/vsc';
import {
  MdConnectWithoutContact,
  MdOutlineAddPhotoAlternate,
  MdOutlineAutoDelete,
  MdOutlineCreateNewFolder,
  MdOutlineFileDownload,
  MdOutlinePhotoLibrary,
} from 'react-icons/md';
import { RiUserStarLine } from 'react-icons/ri';
import { FiUser, FiUserPlus } from 'react-icons/fi';
import { IoTicketOutline } from 'react-icons/io5';
export const menuItems = [
  {
    name: 'Home',
    href: '/',
    icon: <PiHouseLine />,
  },
  {
    name: 'Sellers',
    href: '/sellers',
    icon: <RiUserStarLine />,
  },
  // {
  //   name: 'Onboard',
  //   href: '/seller/onboarding',
  //   icon: <FiUserPlus />,
  // },
  // {
  //   name: 'Pending ',
  //   href: '/onboarding/pending',
  //   icon: <MdOutlinePendingActions />,
  //   badge: '',
  // },

  // {
  //   name: 'Deleted',
  //   href: '/sellers/deleted',
  //   icon: <MdOutlineAutoDelete />,
  //   badge: '',
  // },

  {
    name: 'Requests',
    href: '/onboarding/requests',
    icon: <VscGitPullRequestCreate />,
    badge: '',
  },

  {
    name: 'Users',
    href: '/users',
    icon: <FiUser />,
  },

  // {
  //   name: 'Deleted',
  //   href: '/users/deleted',
  //   icon: <MdOutlineAutoDelete />,
  // },

  // {
  //   name: 'New User',
  //   href: '/users/create',
  //   icon: <FiUserPlus />,
  // },

  {
    name: 'Payouts',
    href: '/payouts/all',
    icon: <CiMoneyCheck1 />,
    badge: '',
  },
  {
    name: 'Create Payout',
    href: '/payouts/create',
    icon: <MdOutlineCreateNewFolder />,
    badge: '',
  },

  {
    name: 'Tickets',
    href: '/tickets',
    icon: <IoTicketOutline />,
    badge: '',
  },

  {
    name: 'Create Ticket',
    href: '/tickets/create',
    icon: <MdOutlineCreateNewFolder />,
    badge: '',
  },

  {
    name: 'Banners',
    href: '/banners',
    icon: <MdOutlinePhotoLibrary />,
    badge: '',
  },

  {
    name: 'Add Banner',
    href: '/banners/create',
    icon: <MdOutlineAddPhotoAlternate />,
    badge: '',
  },

  {
    name: 'Referrals',
    href: '/referrals/all',
    icon: <LuScreenShare />,
    badge: '',
  },

  {
    name: 'Add Referral',
    href: '/referrals/create',
    icon: <MdOutlineCreateNewFolder />,
    badge: '',
  },
  {
    name: 'Contacts',
    href: '/contacts',
    icon: <MdConnectWithoutContact />,
    badge: '',
  },

  // {
  //   name: 'Orders',
  //   href: '/orders',
  //   icon: <PiPackageDuotone />,
  // },
  // {
  //   name: 'Products',
  //   href: '/products',
  //   icon: <PiShoppingCartDuotone />,
  // },
  // {
  //   name: 'Add Product',
  //   href: '/products/create',
  //   icon: <MdOutlineCreateNewFolder />,
  //   badge: '',
  // },
  // {
  //   name: 'Categories',
  //   href: '/categories',
  //   icon: <PiCreditCardDuotone />,
  // },
  // {
  //   name: 'Add Category',
  //   href: '/categories/create',
  //   icon: <MdOutlineCreateNewFolder />,
  //   badge: '',
  // },

  // {
  //   name: 'Coupons',
  //   href: '/coupons',
  //   icon: <RiCoupon2Line />,
  // },
  // {
  //   name: 'Add Coupon',
  //   href: '/coupons/create',
  //   icon: <MdOutlineCreateNewFolder />,
  //   badge: '',
  // },

  // {
  //   name: 'Payouts',
  //   href: '/transactions',
  //   icon: <PiCreditCardDuotone />,
  //   badge: '',
  // },
  // {
  //   name: 'Logistics',
  //   href: '/logistics',
  //   icon: <CiDeliveryTruck />,
  //   badge: '',
  // },
  // {
  //   name: 'Tickets',
  //   href: '/tickets',
  //   icon: <TiTicket />,
  //   badge: '',
  // },
  // {
  //   name: 'Create Ticket',
  //   href: '/tickets/create',
  //   icon: <MdOutlineCreateNewFolder />,
  //   badge: '',
  // },
  {
    name: 'Download Report',
    href: '/report',
    icon: <MdOutlineFileDownload />,
    badge: '',
  },
];
