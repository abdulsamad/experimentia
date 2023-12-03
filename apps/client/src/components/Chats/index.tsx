import { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useUser } from '@auth0/nextjs-auth0/client';

import { chatLoading, chatsAtom, configAtom } from '@/store';
import { ScrollArea } from '@/components/ui/scroll-area';

import Chat from './Chat';
import Empty from './Empty';
import Typing from './Typing';

const Chats = () => {
  const chats = useAtomValue(chatsAtom);
  const isChatResponseLoading = useAtomValue(chatLoading);
  const { textInput } = useAtomValue(configAtom);
  const { user } = useUser();

  useEffect(() => {
    const chats = document.querySelectorAll('.chat');

    if (!chats.length) return;

    chats[chats.length - 1].scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [chats]);

  const userInfo = useCallback(
    (variation: string | null) => ({
      user: {
        containerClassNames: 'ml-auto',
        messageContainerClassNames: 'flex-row-reverse',
        nameContainerClassNames: 'mr-[45px]',
        messageClassNames:
          'bg-primary text-secondary before:right-0 before:translate-x-[70%] before:border-l-primary',
        name: user?.nickname,
        userImageSrc: user?.picture as string,
      },
      assistant: {
        containerClassNames: '',
        nameContainerClassNames: 'ml-[55px]',
        messageContainerClassNames: '',
        messageClassNames:
          'bg-secondary before:left-0 before:-translate-x-[70%] before:rotate-180 before:border-l-secondary',
        name: variation,
        userImageSrc: `/icons/${variation}.png`,
      },
    }),
    [user]
  );

  return (
    <section>
      <ScrollArea className="h-[calc(100vh-170px)] w-full px-3 lg:px-8">
        {chats.length ? (
          <>
            {chats.map((chat, index) => {
              const { variation, type } = chat;
              return <Chat key={index} {...userInfo(variation)[type]} {...chat} />;
            })}
            {isChatResponseLoading && <Typing />}
          </>
        ) : (
          <Empty nickname={user?.nickname} textInput={textInput} />
        )}
      </ScrollArea>
    </section>
  );
};

export default Chats;
