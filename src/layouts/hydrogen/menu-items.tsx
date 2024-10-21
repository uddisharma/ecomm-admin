import { PiHouseLine } from 'react-icons/pi';
import { CiMoneyCheck1 } from 'react-icons/ci';
import { LuScreenShare } from 'react-icons/lu';
import { VscGitPullRequestCreate } from 'react-icons/vsc';
import {
  MdConnectWithoutContact,
  MdOutlineAddPhotoAlternate,
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
  {
    name: 'Download Report',
    href: '/report',
    icon: <MdOutlineFileDownload />,
    badge: '',
  },
];
