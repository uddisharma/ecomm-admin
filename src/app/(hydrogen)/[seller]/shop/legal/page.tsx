'use client';
import Legal from '@/component/account-settings/team-settings';
import { metaObject } from '@/config/site.config';
import { SellerContext } from '@/store/seller/context';
import { UserContext } from '@/store/user/context';
import { useContext } from 'react';

const metadata = {
  ...metaObject('Team'),
};

export default function ProfileSettingsFormPage() {
  const { state } = useContext(SellerContext);
  const legal = state?.seller?.legal;
  return <Legal legal={legal} name={state?.seller?.shopname} />;
}
