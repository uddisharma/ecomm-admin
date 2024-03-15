import { metaObject } from '@/config/site.config';
import ProfileSettingsView from '@/component/account-settings/profile-settings';

export const metadata = {
  ...metaObject('Profile Settings'),
};



export default function ProfileSettingsFormPage() {
  return <ProfileSettingsView />;
}
