'use client';
import { CiDeliveryTruck } from 'react-icons/ci';
import PageHeader from '@/component/others/pageHeader';
import cn from '@/utils/class-names';
import { GoChevronRight } from 'react-icons/go';
import React, { useState } from 'react';
import { Button, Input } from 'rizzui';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
const Page = () => {
  const pageHeader = {
    title: 'Track Order',
    breadcrumb: [
      {
        name: 'Home',
      },
      {
        name: 'Track Order',
      },
    ],
  };
  const [awb, setAwb] = useState('');
  const router = useRouter();

  function generateRandomString() {
    const characters = '0123456789tuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div
        className={cn(
          'relative mt-2 flex flex-col items-center overflow-hidden rounded-xl border border-gray-300 xs:flex-row'
        )}
      >
        <div className="relative h-full min-h-[200px] w-full sm:max-w-[223px]">
          <img
            className=" rounded-t-xl object-cover xs:rounded-none xs:rounded-s-xl"
            src="/delivery.png"
            style={{ display: 'block', margin: 'auto' }}
            alt=""
          />
        </div>

        <div className="flex w-full flex-col justify-between p-5 pb-6 sm:p-6">
          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">
            Track Now
          </h5>
          <p className="mb-2 text-sm font-normal text-gray-500">
            Monitor any order to obtain all the details.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (awb == '') {
                return toast.warning('Tracking / AWB Number is required');
              }
              router.push(`/track/${generateRandomString()}/${awb}`);
            }}
            className="mt-4 flex flex-col items-center gap-3 @lg:mt-0 lg:flex-row"
          >
            <Input
              value={awb}
              onChange={(e) => {
                setAwb(e.target.value);
              }}
              required
              prefix={<CiDeliveryTruck className="w-4" />}
              suffix={<GoChevronRight className="w-4" />}
              placeholder="Tracking / AWB Number"
            />
            <Button
              type="submit"
              variant="outline"
              className="mt-3 w-full sm:w-auto lg:mt-0 lg:w-auto dark:bg-gray-100 dark:text-white"
            >
              Track Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
