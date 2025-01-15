import { SandPackCSS } from '@/components/codeEditor/sandpack-styles';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { cn } from '@/lib/utils';
import { metadata } from './meta';
import { CSPostHogProvider } from './provider';
import { SidebarProvider } from '@/components/ui/sidebar';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />

      <SandPackCSS />

      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <CSPostHogProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
