import Link from 'next/link';
import { Button } from '@/component/ui/button';
import PageHeader from '@/component/others/pageHeader';
import { metaObject } from '@/config/site.config';
import EmailTemplatesGrid from '@/component/email-templates';

export const metadata = {
  ...metaObject('Email Templates'),
};

const pageHeader = {
  title: 'Email Templates',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'Email Templates',
    },
  ],
};

export default function EmailTemplates() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href="https://react.email/" target="_blank">
          <Button tag="span">Learn More</Button>
        </Link>
      </PageHeader>
      <EmailTemplatesGrid />
    </>
  );
}
