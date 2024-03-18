import IntegrationSettingsView from '@/component/account-settings/integration-settings';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Integration'),
};

export default function IntegrationSettingsFormPage() {
  return <IntegrationSettingsView />;
}
