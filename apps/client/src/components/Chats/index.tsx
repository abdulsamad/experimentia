import { useCallback, useLayoutEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useUser } from '@auth0/nextjs-auth0/client';

import { chatLoading, chatsAtom, configAtom } from '@/store';

import Chat from './Chat';
import Empty from './Empty';
import Typing from './Typing';

const Chats = () => {
  const chats = useAtomValue(chatsAtom);
  const isChatResponseLoading = useAtomValue(chatLoading);
  const { textInput } = useAtomValue(configAtom);
  const { user } = useUser();

  useLayoutEffect(() => {
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
        containerClassNames: 'chat-end',
        messageClassNames: 'chat-bubble-info',
        name: user?.nickname,
        userImageSrc: user?.picture as string,
      },
      assistant: {
        containerClassNames: 'chat-start',
        messageClassNames: 'chat-bubble-primary',
        name: variation,
        userImageSrc: `/icons/${variation}.jpg`,
      },
    }),
    [user]
  );

  return (
    <section className="h-full w-full relative">
      <div className="h-[calc(100vh-180px)] absolute top-0 right-0 left-0 bottom-[80px] pt-8 pb-4 px-3 lg:px-8 overflow-x-auto">
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
      </div>
    </section>
  );
};

export default Chats;
