'use client';
import SellerLabel from '@/component/label/page';
import Spinner from '@/component/ui/spinner';
import { BaseApi, singleOrder } from '@/constants';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React from 'react';
import { Text } from 'rizzui';
import useSWR from 'swr';
const Page = () => {
  const params = useParams();
  const fetcher = (url: any) => axios.get(url).then((res) => res.data);
  let {
    data: data1,
    error,
    isLoading,
    mutate,
  } = useSWR(`${BaseApi}${singleOrder}/${params?.id}`, fetcher, {
    refreshInterval: 3600000,
    onErrorRetry({ retrycount }: any) {
      if (retrycount > 3) {
        return false;
      }
    },
  });
  const orderData = data1?.data;
  return (
    <div>
      {error && <Text className="mt-10 text-center">Something went wrong</Text>}
      {isLoading ? <Spinner /> : orderData && <SellerLabel data={orderData} />}
    </div>
  );
};

export default Page;
