import { atom, WritableAtom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { atomWithStorage } from 'jotai/utils';
import * as configcat from 'configcat-js-ssr';
import dayjs from 'dayjs';

import { lforage } from '@/utils';
import { settingsKey } from '@/utils/config';

// Editor

export const editorAtom = atom('');

// Chats

export const chatLoadingAtom = atom(false);

export const currentChatIdAtom = atom(crypto.randomUUID());

interface IChatCommon {
  id: string;
  type: 'assistant' | 'user';
  variation: string | null;
  timestamp: number;
}

interface ITextChat {
  message: string;
  format: 'text';
}

interface IImageChat {
  image: {
    url: string;
    alt: string;
  };
  format: 'image';
}

export type IChat = IChatCommon & (ITextChat | IImageChat);

export const chatsAtom: WritableAtom<IChat[], IChat[], void> = atom(
  [],
  (get, set, update, reset) => {
    // Reset current chat
    if (reset) {
      set(chatsAtom, update);
      return;
    }

    // Add chat normally
    const state = get(chatsAtom);
    const chatIndex = state.findIndex((chat) => chat.id === update.id);
    let chats;

    if (chatIndex !== -1) {
      const prevChat = state[chatIndex] as any;
      state[chatIndex] = { ...prevChat, message: prevChat?.message + (update as any).message };
      chats = state;
    } else {
      chats = [...state, update] as any;
    }

    set(chatsAtom, chats);
  }
);

// Offline storage (Chats & Threads)

export interface IThread {
  id: string;
  chats: IChat[];
  timestamp: number;
  name: string;
}

export type IThreads = IThread[];

export const chatSaveEffect = atomEffect((get, set) => {
  (async () => {
    const chats = get(chatsAtom);
    const chatId = get(currentChatIdAtom);
    const chatsItem: IThread = {
      id: chatId,
      chats,
      timestamp: dayjs(Date.now()).valueOf(),
      name: `Chat (${dayjs(Date.now()).format('hh:mm - DD/MM/YY')})`,
    };

    let updatedThreads;

    // Return if chats doesn't exist
    if (!chats.length || !chatId) return null;

    const threads: IThreads | null = await lforage.getItem('chats');

    if (!threads) {
      lforage.setItem('chats', [chatsItem]);
      return;
    }

    if (!Array.isArray(threads)) return null;

    const threadExists = threads.some(({ id }) => id === chatId);

    if (threadExists) {
      updatedThreads = threads.map((thread) => (thread.id === chatId ? chatsItem : thread));
    } else {
      updatedThreads = [chatsItem, ...threads];
    }

    // Save threads
    await lforage.setItem('chats', updatedThreads);
  })();
});

// Flags

export const configCatClientAtom = atom(
  configcat.getClient(process.env.NEXT_PUBLIC_CONFIGCAT_API_KEY)
);

export const identifierAtom = atom('');

export const flagsAtom = atom(async (get) => {
  const identifier = get(identifierAtom);

  if (identifier) {
    const userObject = new configcat.User(identifier);
    const client = get(configCatClientAtom);

    const gpt4Enabled = await client.getValueAsync('enable-GPT-4', false, userObject);

    const dallE3Enabled = await client.getValueAsync('enable-DALL-E-3', false, userObject);

    return {
      gpt4Enabled,
      dallE3Enabled,
    };
  }

  return null;
});

// Config

interface IConfig {
  model: string;
  variation: string;
  language: string;
  imageSize: string;
  textInput: boolean;
  speakResults: boolean;
}

export const configAtom = atomWithStorage<IConfig>(settingsKey, {
  model: 'gpt-3.5-turbo',
  variation: 'normal',
  language: 'en-IN',
  imageSize: '1024x1024',
  textInput: false,
  speakResults: false,
});

// Sidebar
export const sidebarAtom = atom(false);
