import { Suspense } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useAuth } from '@clerk/react-router';
import { RedirectToSignIn } from '@clerk/react-router';

import { chatSaveEffect, configAtom } from '@/store';
import Text from '@/components/Inputs/Text';
import Voice from '@/components/Inputs/Voice';
import Thread from '@/components/Thread';
import { IS_SPEECH_RECOGNITION_SUPPORTED } from '@/utils';

import type { Route } from './+types/home';

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: 'Experimentia - The AI Chat App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
};

const Home = ({}: Route.ComponentProps) => {
  const { textInput } = useAtomValue(configAtom);

  const { isSignedIn } = useAuth();

  // Subscribe to chat side effects
  useAtom(chatSaveEffect);

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <Suspense>
      <Thread />
      <div className="flex flex-col justify-end">
        <div className="flex flex-col">
          {!textInput && IS_SPEECH_RECOGNITION_SUPPORTED() ? <Voice /> : <Text />}
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
