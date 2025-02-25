'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Root from '@/components/Root';

const Page = () => {
  return <Root />;
};

export default withPageAuthRequired(Page);
