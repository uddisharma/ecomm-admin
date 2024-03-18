import cn from '@/utils/class-names';
import Image from 'next/image';
import React from 'react';
import { CiEdit } from 'react-icons/ci';
import { ActionIcon } from 'rizzui';
import { PiArrowLineUpRightBold } from 'react-icons/pi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TemperoryDeletePopover from '../others/temperory-delete-popover';

const Card1 = ({ data, onDelete }: any) => {
  const params = useParams();

  const images = data?.images && data?.images[0];
  const desktop = images?.desktop?.url;
  const phone = images?.mobile?.url;
  return (
    <div className="m-2 rounded-lg border border-gray-300 p-5">
      <div className="flex flex-row justify-end gap-5">
        <Link target="blank" href={`${data?.redirectLink}`}>
          <ActionIcon
            size="sm"
            variant="outline"
            aria-label={'View Page'}
            className="cursor-pointer hover:!border-gray-900 hover:text-gray-700"
          >
            <PiArrowLineUpRightBold className="h-4 w-4" />
          </ActionIcon>
        </Link>
        <Link href={`/${params?.seller}/banners/${data?.id}/edit`}>
          <ActionIcon
            size="sm"
            variant="outline"
            aria-label={'Edit Banner'}
            className="cursor-pointer hover:!border-gray-900 hover:text-gray-700"
          >
            <CiEdit className="h-4 w-4" />
          </ActionIcon>
        </Link>
        <TemperoryDeletePopover
          title={`Temperory Delete the Banner`}
          description={`Are you sure you want to temperory delete this banner?`}
          onDelete={() => onDelete(data?.id)}
        />
      </div>
      <div
        className={cn(
          'relative mb-5 mt-5 flex flex-col items-center overflow-hidden rounded-xl border border-gray-300 xs:flex-row'
        )}
      >
        <Image
          src={desktop}
          className="max-h-500"
          alt=""
          height={500}
          width={1300}
        />
      </div>
      <div
        className={cn(
          'relative mb-5 mt-5 flex flex-col items-center overflow-hidden rounded-xl border border-gray-300 xs:flex-row'
        )}
      >
        <Image src={phone} alt="" height={400} width={500} />
      </div>
    </div>
  );
};

export default Card1;
