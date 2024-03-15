import PageHeader from '@/component/others/pageHeader';
import ProfileSettingsNav from '@/component/profile/navigation';

const pageHeader = {
  title: 'Admin Profile',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },

    {
      name: 'Admin Profile',
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
