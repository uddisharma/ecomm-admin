import { metaObject } from '@/config/site.config';
import EventCalendarView from '@/component/event-calendar';
import ModalButton from '@/component/others/modal-button';
import ExportButton from '@/component/others/export-button';
import PageHeader from '@/component/others/pageHeader';
import { routes } from '@/config/routes';
import { eventData } from '@/data/event-data';
import EventForm from '@/component/tickets/create/form';

export const metadata = {
  ...metaObject('Event Calendar'),
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
