import { useAtom, useAtomValue } from 'jotai';
import { useAuth } from '@clerk/react-router';
import { RedirectToSignIn } from '@clerk/react-router';

import { chatSaveEffect, configAtom } from '@/store';
import Text from '@/components/Inputs/Text';
import Voice from '@/components/Inputs/Voice';
import Sidebar from '@/components/Sidebar';
import Thread from '@/components/Thread';
import Nav from '@/components/Nav';
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
    <main className="h-[100svh] conic-gradient(at right center, rgb(199, 210, 254), rgb(71, 85, 105), rgb(199, 210, 254))">
      <Nav />
      <Sidebar />
      <div className="lg:container">
        <Thread />
        <div className="flex flex-col justify-end">
          <div className="flex flex-col">
            {!textInput && IS_SPEECH_RECOGNITION_SUPPORTED() ? <Voice /> : <Text />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
