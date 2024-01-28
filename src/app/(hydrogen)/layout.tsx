'use client';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { useLayout } from '@/hooks/use-layout';
import HydrogenLayout from '@/layouts/hydrogen/layout';
import HeliumLayout from '@/layouts/helium/helium-layout';
import { useIsMounted } from '@/hooks/use-is-mounted';
import LithiumLayout from '@/layouts/lithium/lithium-layout';
import { UserProvider } from '@/store/user/context';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layout } = useLayout();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  if (layout === LAYOUT_OPTIONS.HELIUM) {
    return (
      // <UserProvider>
      <HeliumLayout>{children}</HeliumLayout>
      // </UserProvider>
    );
  }
  if (layout === LAYOUT_OPTIONS.LITHIUM) {
    return (
      // <UserProvider>
      <LithiumLayout>{children}</LithiumLayout>
      // </UserProvider>
    );
  }

  return (
    // <UserProvider>
    <HydrogenLayout>{children}</HydrogenLayout>
    // </UserProvider>
  );
}
