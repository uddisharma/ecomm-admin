import { metaObject } from '@/config/site.config';
import Orders from '@/component/Orders/orders';
export const metadata = {
  ...metaObject('Orders'),
};
export default function ProfileSettingsFormPage() {
  return <Orders />;
}
