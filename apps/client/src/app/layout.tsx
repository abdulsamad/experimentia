import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from 'sonner';

import ThemeProvider from '@/components/ThemeProvider';
import { cn } from '@/utils';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'The AI Chat App',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <head />
    <body className={cn('font-sans antialiased', inter.variable)}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <UserProvider>
          <main>{children}</main>
        </UserProvider>
      </ThemeProvider>
      <Toaster richColors />
    </body>
  </html>
);

export default RootLayout;
