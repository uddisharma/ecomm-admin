import { useMemo } from 'react';
import PageHeader from '@/component/others/pageHeader';
import { metaObject } from '@/config/site.config';
import { Metadata } from 'next';
import Tracking from '@/component/Tracking/page';

type Props = {
  params: { awb: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.awb;

  return metaObject(`Tracking ${id}`);
}

export default function TrackingPage({ params }: any) {
  const pageHeader = useMemo(() => {
    return {
      title: 'Tracking',
      breadcrumb: [
        {
          name: 'Home',
        },
        {
          name: 'Tracking',
        },
        {
          name: params.awb,
        },
      ],
    };
  }, [params.awb]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Tracking className="mb-10" />
    </>
  );
}
