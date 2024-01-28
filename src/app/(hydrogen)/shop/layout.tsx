import PageHeader from '@/component/others/pageHeader';
import ProfileSettingsNav from '@/component/account-settings/navigation';

const pageHeader = {
  title: 'Shop Settings',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },

    {
      name: 'Shop Settings',
    },
  ],
};

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProfileSettingsNav />
      {children}
    </>
  );
}
