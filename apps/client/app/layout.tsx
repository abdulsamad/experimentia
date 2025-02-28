import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';

import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/utils';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={cn('font-sans antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <main>{children}</main>
          <Toaster richColors />
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
