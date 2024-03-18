'use client';
import SellerDashboard from '@/component/seller/dashboard';

export default function FileDashboardPage() {
  //   const [cookies, setCookie] = useCookies(['admintoken']);
  //   const router = useRouter();
  //   const { state } = useContext(UserContext);
  //   useEffect(() => {
  //     const cookieValue = cookies.admintoken;
  //     const seller = state?.user?.shopname;
  //     if (!cookieValue || !seller) {
  //       router.push('/auth/sign-in');
  //     }
  //   }, []);

  return <SellerDashboard />;
}
