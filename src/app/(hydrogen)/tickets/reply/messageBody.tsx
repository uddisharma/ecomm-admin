import React, { useContext, useEffect, useRef } from 'react';
import { Title } from '@/component/ui/text';
import { DotSeparator } from '@/component/chat/message-details';
import { Avatar, Empty } from 'rizzui';
import cn from '@/utils/class-names';
import { UserContext } from '@/store/user/context';

export default function MessageBody({ chat }: any) {
  const chat1 = chat?.data?.replies;
  const { state: st } = useContext(UserContext);
  const chatContainerRef = useRef<any>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [chat1]);

  if (!chat1?.length) {
    return (
      <div
        className={cn(
          'mt-8 !grid h-full min-h-[128px] flex-grow place-content-center items-center justify-center'
        )}
      >
        <Empty
          text="No conversations found"
          textClassName="mt-4 text-base text-gray-500"
        />
      </div>
    );
  }

  return (
    <div ref={chatContainerRef} className="max-h-[50rem] overflow-y-auto">
      {chat1?.map((e: any, i: any) => (
        <div style={{ marginTop: '20px' }} key={i}>
          {st?.user?.id == e?.from ? (
            <div className="grid grid-cols-[32px_1fr] items-start gap-3 lg:gap-4 xl:grid-cols-[48px_1fr]">
              <Avatar
                name={st?.user?.shopname}
                src={st?.user?.cover}
                className="!h-5 !w-5 bg-[#70C5E0] font-medium text-white xl:!h-8 xl:!w-8"
              />

              <div className="-mt-1.5 lg:mt-0">
                <div className="mt-1.5 items-center gap-2 text-xs text-gray-500 lg:flex">
                  <Title as="h3" className="text-sm font-medium  text-gray-700">
                    {e?.message}
                  </Title>
                  <DotSeparator className="hidden lg:block" />

                  <span>{e.time}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[32px_1fr] items-start gap-3 lg:gap-4 xl:grid-cols-[48px_1fr]">
              <Avatar
                name={chat?.data?.seller?.shopname}
                src={chat?.data?.seller?.cover}
                className="!h-5 !w-5 bg-[#70C5E0] font-medium text-white xl:!h-8 xl:!w-8"
              />

              <div className="-mt-1.5 lg:mt-0">
                <div className="mt-1.5 items-center gap-2 text-xs text-gray-500 lg:flex">
                  <Title as="h3" className="text-sm font-medium  text-gray-700">
                    {e?.message}
                  </Title>
                  <DotSeparator className="hidden lg:block" />
                  <span>{e.time}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
