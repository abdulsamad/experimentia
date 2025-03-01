import { Suspense, useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAuth, RedirectToSignIn } from '@clerk/react-router';

import { threadAtom, currentThreadIdAtom, type IThreads } from '@/store';
import { getThreads } from '@/utils/lforage';
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

const Home = ({ params }: Route.ComponentProps) => {
  const { textInput } = useAtomValue(configAtom);
  const setCurrentThreadId = useSetAtom(currentThreadIdAtom);
  const setThread = useSetAtom(threadAtom);
  const [threads, setThreads] = useState<IThreads>([]);

  const { isSignedIn } = useAuth();

  const threadId = params.threadId;

  // Subscribe to chat side effects
  useAtom(chatSaveEffect);

  useEffect(() => {
    if (!threadId) return;

    const thread = threads?.find(({ id }) => id === threadId);

    if (thread) {
      setCurrentThreadId(thread.id);
      setThread(thread.thread as any, true as any);
    }
  }, [setThread, setCurrentThreadId, threadId, threads]);

  useEffect(() => {
    (async () => {
      const threads = await getThreads();
      setThreads(threads);
    })();
  }, []);

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
