'use client';

import { useAtomValue } from 'jotai';
import { useState, useEffect, useContext } from 'react';
import { Title } from '@/component/ui/text';
import { Badge } from '@/component/ui/badge';
import { Button } from '@/component/ui/button';
import { Avatar } from '@/component/ui/avatar';
import { dataAtom, messageIdAtom } from '@/component/chat/message-list';
import ActionDropdown from '@/component/chat/action-dropdown';
import MessageBody from './messageBody';
import cn from '@/utils/class-names';
import SimpleBar from '@/component/ui/simplebar';
import { useElementSize } from '@/hooks/use-element-size';
import { useMedia } from '@/hooks/use-media';
import Spinner from '@/component/ui/spinner';
import { ActionIcon, Empty, Input, SearchNotFoundIcon } from 'rizzui';
import axios from 'axios';

import useSWR from 'swr';
// import { BaseApi } from '@/constants/page';
import { useParams } from 'next/navigation';
import { FaTelegramPlane } from 'react-icons/fa';
import {
  BaseApi,
  singleAdminTicket,
  singleTicket,
  ticketReply,
} from '@/constants';
import { UserContext } from '@/store/user/context';
import { toast } from 'sonner';

export default function ReplyDetails({ className }: { className?: string }) {
  const data = useAtomValue(dataAtom);
  const messageId = useAtomValue(messageIdAtom);
  const params = useParams();
  const [ref, { width }] = useElementSize();
  const isWide = useMedia('(min-width: 1280px) and (max-width: 1440px)', false);

  function formWidth() {
    if (isWide) return width - 64;
    return width - 44;
  }

  const isMobile = useMedia('(max-width: 767px)', true);

  const fetcher = (url: any) => axios.get(url).then((res) => res.data);

  const {
    data: data2,
    isLoading,
    mutate,
  } = useSWR(`${BaseApi}${singleAdminTicket}/${params?.id}`, fetcher, {
    refreshInterval: 3600000,
  });

  const message = data.find((m) => m.id === messageId) ?? data[0];

  const initials = `${message?.firstName.charAt(0)}${message?.lastName.charAt(
    0
  )}`;

  function getCurrentDateTimeIndia() {
    // Set the time zone offset to IST (UTC+5:30)
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() < 12 ? 'AM' : 'PM';

    const formattedDateTime = `${day}-${month}-${year}  ${hours}:${minutes}${ampm}`;

    return formattedDateTime;
  }
  const [r_message, setRMessage] = useState('');

  const sendReply = async () => {
    try {
      if (r_message == '') {
        return;
      }
      await axios.patch(`${BaseApi}${ticketReply}`, {
        ticketId: params?.id,
        from: params?.seller,
        message: r_message,
        time: getCurrentDateTimeIndia(),
      });
      await mutate();
      setRMessage('');
    } catch (error) {
      return toast.error('Something went wrong');
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          '!grid h-full min-h-[128px] flex-grow place-content-center items-center justify-center',
          className
        )}
      >
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative pt-6 lg:rounded-lg lg:border lg:border-gray-200 lg:px-4 lg:py-7 xl:px-5 xl:py-5 2xl:pb-7 2xl:pt-6',
        className
      )}
    >
      <div>
        <header className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 3xl:flex-row 3xl:items-center">
          <div className="flex flex-row flex-wrap items-start justify-between gap-3 xs:flex-row xs:items-center xs:gap-6 lg:justify-normal">
            <Title as="h4" className="font-semibold">
              {data2?.data?.subject}
            </Title>
            <Badge variant="outline" color="primary" size="sm">
              {data2?.data?.type}
            </Badge>
            {data2?.data?.closed === false ? (
              <Badge variant="outline" color="success" size="sm">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" color="danger" size="sm">
                Closed
              </Badge>
            )}
            {/* <div className="jus flex flex-wrap items-center gap-2.5 sm:justify-end">
              <ActionDropdown className="ml-auto sm:ml-0" />
            </div> */}
          </div>
          <div dangerouslySetInnerHTML={{ __html: data2?.data?.description }} />
        </header>

        <div
          style={{
            minHeight: isMobile ? '400px' : '350px',
            maxHeight: isMobile ? '400px' : '350px',
            overflowY: 'scroll',
          }}
          className="[&_.simplebar-content]:grid [&_.simplebar-content]:gap-8 [&_.simplebar-content]:py-5"
        >
          <SimpleBar className="@3xl:max-h-[calc(100dvh-34rem)] @4xl:max-h-[calc(100dvh-32rem)] @7xl:max-h-[calc(100dvh-31rem)]">
            <MessageBody chat={data2} />
          </SimpleBar>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-[32px_1fr] items-start gap-3 rounded-b-lg bg-white @3xl:pt-4 lg:gap-4 lg:pl-0 xl:grid-cols-[48px_1fr] dark:bg-transparent dark:lg:pt-0"
        >
          <figure className="dark:mt-4">
            <Avatar
              name={'Seller'}
              initials={initials}
              src={
                'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp'
              }
              className="!h-5 !w-5 bg-[#70C5E0] font-medium text-white xl:!h-8 xl:!w-8"
            />
          </figure>
          <div
            className={`relative rounded-lg bg-gray-50 p-4 2xl:p-5`}
            style={{
              maxWidth: formWidth(),
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: '8' }}>
                <Input
                  onChange={(e) => {
                    setRMessage(e.target.value);
                  }}
                  value={r_message}
                  placeholder="Reply..."
                  className="col-span-full"
                />
              </div>
              <div className="relative mb-2.5 flex items-center justify-between">
                <Button
                  type="button"
                  onClick={sendReply}
                  className="dark:bg-gray-200 dark:text-white"
                >
                  <ActionIcon
                    size="sm"
                    variant="text"
                    className="p-0 text-gray-500 hover:!text-gray-900"
                  >
                    <FaTelegramPlane className="h-[18px] w-[18px]" />
                  </ActionIcon>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DotSeparator({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
      {...props}
    >
      <circle cx="2" cy="2" r="2" fill="#D9D9D9" />
    </svg>
  );
}
