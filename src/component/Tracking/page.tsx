'use client';

import cn from '@/utils/class-names';
import { useParams } from 'next/navigation';
import { Title, Text } from '@/component/ui/text';
import { Button } from '@/component/ui/button';
import { PiCopySimple, PiMoped } from 'react-icons/pi';
import Timeline from './timeline';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import BannerLoading from '@/component/loading/bannerLoading';
import TrackLoading from '@/component/loading/trackLoading';

const data = {
  status: true,
  data: {
    id: '2482000',
    order_id: '4340000',
    order_number: '#JS5897',
    created: '2021-03-01',
    awb_number: '59650109492',
    rto_awb: '75312963180',
    courier_id: '24',
    warehouse_id: '21135',
    rto_warehouse_id: '21135',
    status: 'rto',
    rto_status: 'delivered',
    shipment_info: 'DEL / VED',
    history: [
      {
        status_code: 'IT',
        location: 'BAREJA EPU (NCX)',
        event_time: '2021-03-02 18:19',
        message: 'SHIPMENT ARRIVED',
      },
      {
        status_code: 'IT',
        location: 'BAREJA EPU (NCX)',
        event_time: '2021-03-02 22:07',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'IT',
        location: 'AHMEDABAD HUB (AUB)',
        event_time: '2021-03-02 23:50',
        message: 'SHIPMENT ARRIVED AT HUB',
      },
      {
        status_code: 'IT',
        location: 'AHMEDABAD HUB (AUB)',
        event_time: '2021-03-03 03:20',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'IT',
        location: 'DELHI HUB (DUB)',
        event_time: '2021-03-03 07:27',
        message: 'SHIPMENT ARRIVED AT HUB',
      },
      {
        status_code: 'IT',
        location: 'GOPINATH BAZAR HUB (GNH)',
        event_time: '2021-03-03 13:14',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'IT',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-03 14:50',
        message: 'SHIPMENT ARRIVED',
      },
      {
        status_code: 'OFD',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-03 14:51',
        message: 'SHIPMENT OUT FOR DELIVERY',
      },
      {
        status_code: 'EX',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-03 16:03',
        message: 'REFUSAL CONFIRMATION CODE VERIFIED',
      },
      {
        status_code: 'EX',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-03 16:04',
        message: 'CONSIGNEE REFUSED TO ACCEPT',
      },
      {
        status_code: 'IT',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-04 09:55',
        message: 'UNDELIVERED SHIPMENT HELD AT LOCATION',
      },
      {
        status_code: 'IT',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-05 10:16',
        message: 'UNDELIVERED SHIPMENT HELD AT LOCATION',
      },
      {
        status_code: 'RT-IT',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-05 17:18',
        message: "RETURNED TO ORIGIN AT SHIPPER'S REQUEST",
      },
      {
        status_code: 'RT-IT',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-05 17:18',
        message: 'SHIPMENT ARRIVED',
      },
      {
        status_code: 'RT-IT',
        location: 'PASCHIM VIHAR ETAIL (VED)',
        event_time: '2021-03-05 19:52',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'RT-IT',
        location: 'DELHI HUB (DUB)',
        event_time: '2021-03-05 23:57',
        message: 'SHIPMENT ARRIVED AT HUB',
      },
      {
        status_code: 'RT-IT',
        location: 'DELHI HUB (DUB)',
        event_time: '2021-03-06 02:05',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'RT-IT',
        location: 'DEL ETAIL HUB (DEH)',
        event_time: '2021-03-06 02:54',
        message: 'SHIPMENT IN TRANSIT',
      },
      {
        status_code: 'RT-IT',
        location: 'DEL ETAIL HUB (DEH)',
        event_time: '2021-03-06 03:35',
        message: 'SHIPMENT ARRIVED',
      },
      {
        status_code: 'RT-IT',
        location: 'DEL ETAIL HUB (DEH)',
        event_time: '2021-03-06 05:10',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'RT-IT',
        location: 'COD PROCESSING CENTRE II (ITG)',
        event_time: '2021-03-06 07:05',
        message: 'SHIPMENT IN TRANSIT',
      },
      {
        status_code: 'RT-IT',
        location: 'COD PROCESSING CENTRE II (ITG)',
        event_time: '2021-03-06 07:06',
        message: 'SHIPMENT ARRIVED',
      },
      {
        status_code: 'RT-IT',
        location: 'COD PROCESSING CENTRE II (ITG)',
        event_time: '2021-03-07 05:00',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'RT-IT',
        location: 'ASLALI WAREHOUSE (ASL)',
        event_time: '2021-03-08 00:12',
        message: 'SHIPMENT ARRIVED AT HUB',
      },
      {
        status_code: 'RT-IT',
        location: 'ASLALI WAREHOUSE (ASL)',
        event_time: '2021-03-08 04:46',
        message: 'SHIPMENT FURTHER CONNECTED',
      },
      {
        status_code: 'RT-IT',
        location: 'AHMEDABAD (PMX)',
        event_time: '2021-03-08 06:24',
        message: 'SHIPMENT ARRIVED',
      },
      {
        status_code: 'RT-IT',
        location: 'AHMEDABAD (PMX)',
        event_time: '2021-03-08 07:21',
        message: 'SHIPMENT OUT FOR DELIVERY',
      },
      {
        status_code: 'RT-DL',
        location: 'AHMEDABAD (PMX)',
        event_time: '2021-03-08 11:24',
        message: 'SHIPMENT DELIVERED',
      },
    ],
  },
};

// const newdata = data.data.history.sort(
//   (a: any, b: any) => new Date(b.event_time) - new Date(a.event_time)
// );
interface HistoryItem {
  event_time: string; // Adjust the type accordingly based on your data structure
  // Include other properties if needed
}

const newdata: HistoryItem[] = data.data.history.sort(
  (a: HistoryItem, b: HistoryItem) =>
    new Date(b.event_time).getTime() - new Date(a.event_time).getTime()
);

const isLoading = false;

export default function Tracking({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-10 lg:grid-cols-2 xl:gap-20',
        className
      )}
    >
      {isLoading ? (
        <>
          <BannerLoading />
          {[1, 2, 3, 4, 5, 6, 7].map((e) => (
            <TrackLoading key={e} />
          ))}
        </>
      ) : (
        <>
          <div>
            <TrackingSummary data={newdata} />
          </div>
          <div>
            <Timeline data={newdata} showmoreButton={true} order="desc" />
          </div>
        </>
      )}
    </div>
  );
}

export function TrackingSummary({ data }: any) {
  const params = useParams();
  const [isCopied, setCopied] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();

  function handleCopyToClipboard(value: string) {
    copyToClipboard(value);
    toast.success(<b>{`Copied '${value}' to clipboard`}</b>);

    setCopied(() => true);
    setTimeout(() => {
      setCopied(() => false);
    }, 2000);
  }
  return (
    <>
      <Text className="mb-2 text-gray-700">Tracking Number:</Text>
      <Title
        as="h2"
        className="mb-3 text-2xl font-bold text-gray-700 3xl:text-3xl"
      >
        {params.awb}
      </Title>

      <div className="mb-7 flex items-center gap-x-5">
        <Button
          variant="text"
          onClick={() => handleCopyToClipboard(params.awb as string)}
          className="inline-flex h-auto w-auto items-center gap-1 px-0 py-0 font-normal"
        >
          <PiCopySimple className="h-5 w-5" />
          <Text as="span" className="text-gray-700">
            {isCopied ? 'Copied' : 'Copy'}
          </Text>
        </Button>
        <Text className="inline-flex items-center gap-1">
          <PiMoped className="h-5 w-5" />
          <Text as="span" className="text-gray-700">
            Add to delivery information
          </Text>
        </Text>
      </div>

      <div className="max-w-[505px] rounded-lg border border-l-4 border-primary bg-primary-lighter/10 p-7">
        <Title as="h3" className="mb-3 text-xl font-semibold text-gray-900">
          Latest Update
        </Title>
        {data && data[0] && (
          <Text className="mb-2 text-gray-500 md:text-base md:leading-relaxed">
            {data[0].message} at {data[0].event_time} and location is
            <Text as="span" className="font-semibold text-gray-700">
              {' '}
              {data[0].location}
            </Text>
          </Text>
        )}
      </div>
    </>
  );
}
