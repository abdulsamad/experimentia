import { MetaFunction, Outlet } from 'react-router';
import { Provider } from 'jotai';
import { rootAuthLoader } from '@clerk/react-router/ssr.server';
import { ClerkProvider } from '@clerk/react-router';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import type { Route } from './+types/root';
import ErrorBoundary from './error';
import Layout from './layout';
import Loading from './loading';

import './app.css';

export const meta: MetaFunction = () => [
  {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

export const HydrateFallback = Loading;

const App = ({ loaderData }: Route.ComponentProps) => {
  return (
    <ClerkProvider
      loaderData={loaderData}
      signUpFallbackRedirectUrl="/"
      signInFallbackRedirectUrl="/">
      <VercelAnalytics />
      <Provider>
        <Outlet />
      </Provider>
    </ClerkProvider>
  );
};

export { ErrorBoundary, Layout };

export default App;
