'use client';
import { PiXBold } from 'react-icons/pi';
import { SubmitHandler } from 'react-hook-form';
import { ActionIcon, Button, Input, Title } from 'rizzui';
import { useModal } from '@/component/modal-views/use-modal';
import { Form } from '@/component/ui/form';
import { Text } from '@/component/ui/text';
import {
  EventFormInput,
  eventFormSchema,
} from '@/utils/validators/create-event.schema';
import QuillEditor from '@/component/ui/quill-editor';

export default function InfoModal({ startDate, endDate, event }: any) {
  const { closeModal } = useModal();
  const onSubmit: SubmitHandler<EventFormInput> = (data) => {
    // closeModal();
  };

  return (
    <div className="m-auto p-4 md:px-7 md:py-10">
      <div className="mb-0 flex items-end justify-between">
        <Text className="text-xl">{event?.subject}</Text>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
      </div>

      <>
        <br />
        <Text>
          <div
            dangerouslySetInnerHTML={{
              __html: event?.desc,
            }}
          />
        </Text>
      </>
    </div>
  );
}
