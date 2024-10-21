'use client'
import PageHeader from '@/component/others/pageHeader';
import ProfileSettingsNav from '@/component/account-settings/navigation';
import { useParams } from 'next/navigation';

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams()
  const pageHeader = {
    title: 'Shop Settings',
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: `${params?.seller}/dashboard`,
        name: 'Seller',
      },
      {
        name: 'Shop Settings',
      },
    ],
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProfileSettingsNav />
      {children}
    </>
  );
}
