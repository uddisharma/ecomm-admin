import { Metadata } from 'next';
import { metaObject } from '@/config/site.config';

import ReplyDetails from '../messageDetails';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = params.id;

  return metaObject(`Message ${id}`);
}

export default function Page() {
  return (
    <>
      <div className="">
        <ReplyDetails />
      </div>
    </>
  );
}
