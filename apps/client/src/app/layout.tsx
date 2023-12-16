import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from 'sonner';

import ThemeProvider from '@/components/ThemeProvider';
import { cn } from '@/utils';
import './globals.css';

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'The AI Chat App',
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <UserProvider>{children}</UserProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
