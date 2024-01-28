// 'use client';

// import {
//   useForm,
//   useWatch,
//   FormProvider,
//   type SubmitHandler,
// } from 'react-hook-form';
// import { useState } from 'react';
// import { useSetAtom } from 'jotai';
// import toast from 'react-hot-toast';
// import isEmpty from 'lodash/isEmpty';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from '@/component/ui/button';

// import { defaultValues } from '@/app/shared/ecommerce/order/order-form/form-utils';

// import cn from '@/utils/class-names';
// import { Text, Title } from '@/component/ui/text';
// import OrderSummery from '@/app/shared/ecommerce/checkout/order-summery';
// import { useRouter } from 'next/navigation';
// import { routes } from '@/config/routes';
// import { DUMMY_ID } from '@/config/constants';
// import OrderNote from '@/app/shared/ecommerce/checkout/order-note';
// import {
//   billingAddressAtom,
//   orderNoteAtom,
//   shippingAddressAtom,
// } from '@/store/checkout';
// import {
//   CreateOrderInput,
//   orderFormSchema,
// } from '@/utils/validators/create-order.schema';

// import EventForm from './form';

// // main order form component for create and update order
// export default function CreateTicket({
//   id,
//   order,
//   className,
// }: {
//   id?: string;
//   className?: string;
//   order?: CreateOrderInput;
// }) {
//   const [isLoading, setLoading] = useState(false);
//   const router = useRouter();
//   const setOrderNote = useSetAtom(orderNoteAtom);
//   const setBillingAddress = useSetAtom(billingAddressAtom);
//   const setShippingAddress = useSetAtom(shippingAddressAtom);

//   const methods = useForm({
//     defaultValues: defaultValues(order),
//     resolver: zodResolver(orderFormSchema),
//   });

//   const onSubmit: SubmitHandler<CreateOrderInput> = (data) => {
//     // console.log('data', data);

//     // set timeout ony required to display loading state of the create order button
//     if (sameShippingAddress) {
//       setBillingAddress(data.billingAddress);
//       setShippingAddress(data.billingAddress);
//     } else {
//       if (!isEmpty(data.shippingAddress)) {
//         setShippingAddress(data.shippingAddress);
//       }
//     }
//     setOrderNote(data?.note as string);

//     setLoading(true);

//     setTimeout(() => {
//       setLoading(false);
//       console.log('createOrder data ->', data);
//       // router.push(routes.eCommerce.orderDetails(DUMMY_ID));
//       toast.success(
//         <Text as="b">Order {id ? 'Updated' : 'placed'} successfully!</Text>
//       );
//     }, 600);
//   };

//   const sameShippingAddress = useWatch({
//     control: methods.control,
//     name: 'sameShippingAddress',
//   });

//   return (
//     <FormProvider {...methods}>
//       <form
//         // @ts-ignore
//         onSubmit={methods.handleSubmit(onSubmit)}
//         className={cn(
//           'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium',
//           className
//         )}
//       >
//         <div
//           style={{ marginTop: '-40px' }}
//           //   className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10"
//         >
//           <EventForm />
//         </div>
//       </form>
//     </FormProvider>
//   );
// }

import React from 'react';

const page = () => {
  return <div>page</div>;
};

export default page;
