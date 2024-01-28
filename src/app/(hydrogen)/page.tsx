'use client';
import { metaObject } from '@/config/site.config';
import EcommerceDashboard from '@/component/ecommerce/dashboard';
import { useCookies } from 'react-cookie';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/store/user/context';

const metadata = {
  ...metaObject(),
};

export default function FileDashboardPage() {
  const [cookies, setCookie] = useCookies(['sellertoken']);
  const router = useRouter();
  const { state } = useContext(UserContext);
  useEffect(() => {
    const cookieValue = cookies.sellertoken;
    const seller = state?.user?.shopname;
    if (!cookieValue || !seller) {
      router.push('/auth/sign-in');
    }
  }, []);

  return <EcommerceDashboard />;
}
