'use client';
import HorizontalFormBlockWrapper from '../account-settings/horiozontal-block';
import PageHeader from '../others/pageHeader';
import OrdersList from './orders-list';

export default function Orders() {
  const pageHeader = {
    title: "User's Order",
    breadcrumb: [
      {
        href: '/',
        name: 'Home',
      },
      {
        href: '/users',
        name: 'Users',
      },
      {
        name: 'Orders',
      },
    ],
  };
  return (
    <div className="@container">
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div>
        <OrdersList className="mb-6" />
      </div>
    </div>
  );
}
