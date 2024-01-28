'use client';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import GlobalDrawer from '@/component/drawer-views/container';
import GlobalModal from '@/component/modal-views/container';
import { ThemeProvider } from '@/component/others/theme-provider';
import { siteConfig } from '@/config/site.config';
import { inter, lexendDeca } from '@/app/fonts';
import cn from '@/utils/class-names';
import { Toaster1 } from '@/component/ui/toast';

const NextProgress = dynamic(() => import('@/component/others/next-progress'), {
  ssr: false,
});
// styles
import '@/app/globals.css';
import { UserProvider } from '@/store/user/context';

const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, 'font-inter')}
      >
        <UserProvider>
          <ThemeProvider>
            <NextProgress />
            {children}
            <Toaster />
            <Toaster1 />
            <GlobalDrawer />
            <GlobalModal />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
