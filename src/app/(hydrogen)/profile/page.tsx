import ProfileSettingsView from '@/component/profile/page';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Profile Settings'),
};

export default function ProfileSettingsFormPage() {
  return <ProfileSettingsView />;
}
