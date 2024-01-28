'use client';
import Legal from '@/component/account-settings/team-settings';
import { metaObject } from '@/config/site.config';
import { UserContext } from '@/store/user/context';
import { useContext } from 'react';

const metadata = {
  ...metaObject('Team'),
};

export default function ProfileSettingsFormPage() {
  const { state } = useContext(UserContext);
  const legal = state?.user?.legal;
  return <Legal legal={legal} />;
}
