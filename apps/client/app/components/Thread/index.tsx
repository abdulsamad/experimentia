import { type HTMLAttributes, useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useUser } from '@clerk/react-router';

import { threadLoadingAtom, chatAtom, configAtom } from '@/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getName } from '@/utils';

import Message from './Message';
import Empty from './Empty';
import Typing from './Typing';

export type UserInfo = Record<
  'user' | 'assistant',
  {
    name: string | undefined | null;
    avatarImageSrc: string;
    messageClassNames: HTMLAttributes<HTMLSpanElement>['className'];
  }
>;

const Chats = () => {
  const chats = useAtomValue(chatAtom);
  const isChatResponseLoading = useAtomValue(threadLoadingAtom);
  const { textInput } = useAtomValue(configAtom);

  const { user } = useUser();

  useEffect(() => {
    const chats = document.querySelectorAll('.chat');

    if (!chats.length) return;

    setTimeout(() => {
      chats[chats.length - 1].scrollIntoView({
        behavior: 'instant',
        block: 'start',
      });
    }, 200);
  }, [chats]);

  const userInfo = useCallback(
    (variation: string | null): UserInfo => ({
      user: {
        name: getName(user),
        avatarImageSrc: user?.imageUrl!,
        messageClassNames:
          'bg-primary text-secondary before:right-0 before:translate-x-[70%] before:border-l-primary',
      },
      assistant: {
        name: variation?.split('-').join(' '),
        avatarImageSrc: `/icons/${variation}.png`,
        messageClassNames:
          'bg-secondary before:left-0 before:-translate-x-[70%] before:rotate-180 before:border-l-secondary',
      },
    }),
    [user]
  );

  return (
    <section>
      <ScrollArea className="h-[calc(100vh-170px)] w-full px-6 lg:px-8 box-border">
        {chats.length ? (
          <>
            {chats.map((chat, index) => {
              const { variation, type } = chat;
              return <Message key={index} {...userInfo(variation)[type]} {...chat} />;
            })}
            {isChatResponseLoading && <Typing />}
          </>
        ) : (
          <Empty name={getName(user)} textInput={textInput} />
        )}
      </ScrollArea>
    </section>
  );
};

export default Chats;
