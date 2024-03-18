import { CreateOrderInput } from '@/utils/validators/create-order.schema';

export function defaultValues(order?: CreateOrderInput) {
  return {
    billingAddress: {
      customerName: order?.billingAddress?.customerName,
      phoneNumber: order?.billingAddress?.phoneNumber,
      country: order?.billingAddress?.country,
      state: order?.billingAddress?.state,
      city: order?.billingAddress?.city,
      zip: order?.billingAddress?.zip,
      street: order?.billingAddress?.street,
    },
    sameShippingAddress: order?.sameShippingAddress ?? true,
    shippingAddress: {
      customerName: order?.shippingAddress?.customerName,
      phoneNumber: order?.shippingAddress?.phoneNumber,
      country: order?.shippingAddress?.country,
      state: order?.shippingAddress?.state,
      city: order?.shippingAddress?.city,
      zip: order?.shippingAddress?.zip,
      street: order?.shippingAddress?.street,
    },
    note: order?.note,
    paymentMethod: order?.paymentMethod,
    shippingMethod: order?.shippingMethod,
    shippingSpeed: order?.shippingSpeed,
    cardPayment: {
      cardNumber: order?.cardPayment?.cardNumber,
      expireMonth: order?.cardPayment?.expireMonth,
      expireYear: order?.cardPayment?.expireYear,
      cardCVC: order?.cardPayment?.cardCVC,
      cardUserName: order?.cardPayment?.cardUserName,
      isSaveCard: order?.cardPayment?.isSaveCard,
    },
  };
}

export const orderData = {
  billingAddress: {
    customerName: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    street: '',
  },
  sameShippingAddress: true,
  shippingAddress: {
    customerName: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    street: '',
  },
  note: '',
  paymentMethod: '',
  shippingMethod: '',
  shippingSpeed: '',
};
