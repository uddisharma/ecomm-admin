import IconsList from '@/component/icons/icons-list';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Icons'),
};

export default function IconsPage() {
  return <IconsList />;
}
