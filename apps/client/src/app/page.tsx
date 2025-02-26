import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Root from '@/components/Root';

const Page = async () => {
  return <Root />;
};

export default withPageAuthRequired(Page);
