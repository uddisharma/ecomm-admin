import { metaObject } from '@/config/site.config';
import EventCalendarView from '@/component/event-calendar';
import PageHeader from '@/component/others/pageHeader';

export const metadata = {
  ...metaObject('Download Report'),
};

const pageHeader = {
  title: 'Downlaod Report',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'Download Report',
    },
  ],
};

export default function EventCalendarPage() {
  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      ></PageHeader>

      <EventCalendarView />
    </>
  );
}
