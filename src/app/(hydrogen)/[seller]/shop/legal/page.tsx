'use client';
import Legal from '@/component/account-settings/team-settings';
import { SellerContext } from '@/store/seller/context';
import { useContext } from 'react';

export default function ProfileSettingsFormPage() {
  const { state } = useContext(SellerContext);
  const legal = state?.seller?.legal;
  return <Legal legal={legal} name={state?.seller?.shopname} />;
}
