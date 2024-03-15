import cn from '@/utils/class-names';
import { Title } from '@/component/ui/text';

type UserInfoType = {
  name: string;
  address: string;
  email: string;
  country: string;
  phone: string;
  city: string;
};

const user1 = {
  name: '',
  address: '',
  email: '',
  country: '',
  phone: '',
  city: '',
};
const user2 = {
  name: '',
  address: '',
  email: '',
  country: '',
  phone: '',
  city: '',
};

interface AddressesProps {
  order: any;
  className?: string;
}

export default function Addresses({ order, className }: AddressesProps) {
  return (
    <div className={cn('grid gap-6 @2xl:grid-cols-2 @3xl:gap-10', className)}>
      <AddressCard order={order} title="Sender’s Details" userInfo={user1} />
      <AddressCard1
        order={order}
        title="Recipient’s Details"
        userInfo={user2}
      />
    </div>
  );
}

function AddressCard({
  order,
  title,
  className,
  userInfo,
}: {
  order: any;
  title: string;
  className?: string;
  userInfo: UserInfoType;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-300 p-5 @3xl:p-7 ',
        className
      )}
    >
      <Title as="h3" className="text-base font-semibold sm:text-lg">
        {title}
      </Title>
      <ul className="mt-4 grid gap-3 @3xl:mt-5">
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Name :</span>
          <span>{order?.sellerId?.shopname}</span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Email :</span>
          <span>{order?.sellerId?.email.toLowerCase()}</span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Phone :</span>
          <span>{order?.sellerId?.mobileNo}</span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Address :</span>
          <span>{order?.sellerId?.shopaddress?.address1}</span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">City :</span>
          <span>
            {order?.sellerId?.shopaddress?.city} (
            {order?.sellerId?.shopaddress?.pincode})
          </span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">State :</span>
          <span>{order?.sellerId?.shopaddress?.state}</span>
        </li>
      </ul>
    </div>
  );
}
function AddressCard1({
  order,
  title,
  className,
  userInfo,
}: {
  order: any;
  title: string;
  className?: string;
  userInfo: UserInfoType;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-300 p-5 @3xl:p-7 ',
        className
      )}
    >
      <Title as="h3" className="text-base font-semibold sm:text-lg">
        {title}
      </Title>
      <ul className="mt-4 grid gap-3 @3xl:mt-5">
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Name :</span>
          <span>{order?.customerId?.name}</span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Email :</span>
          <span>{order?.customerId?.email.toLowerCase()}</span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Phone :</span>
          <span>{order?.customerId?.mobileNo}</span>
        </li>
        <li className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">Address :</span>
          <span>
            {order?.customerId?.shippingAddress.filter(
              (address: any) => address._id == order?.addressId
            )[0]?.address
              ? order?.customerId?.shippingAddress.filter(
                  (address: any) => address._id == order?.addressId
                )[0]?.address
              : 'Address Not Found'}
          </span>
        </li>
        {order?.customerId?.shippingAddress.filter(
          (address: any) => address._id == order?.addressId
        )[0]?.address && (
          <>
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">Landmark :</span>
              <span>
                {
                  order?.customerId?.shippingAddress.filter(
                    (address: any) => address._id == order?.addressId
                  )[0]?.landmark
                }
              </span>
            </li>
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">City :</span>
              <span>
                {
                  order?.customerId?.shippingAddress.filter(
                    (address: any) => address._id == order?.addressId
                  )[0]?.city
                }
              </span>
            </li>
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">District :</span>
              <span>
                {
                  order?.customerId?.shippingAddress.filter(
                    (address: any) => address._id == order?.addressId
                  )[0]?.district
                }{' '}
                (
                {
                  order?.customerId?.shippingAddress.filter(
                    (address: any) => address._id == order?.addressId
                  )[0]?.pincode
                }
                )
              </span>
            </li>
            <li className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">State :</span>
              <span>
                {
                  order?.customerId?.shippingAddress.filter(
                    (address: any) => address._id == order?.addressId
                  )[0]?.state
                }
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
