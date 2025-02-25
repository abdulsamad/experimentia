'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Root from './root';

const Page = () => {
  return <Root />;
};

export default withPageAuthRequired(Page);
