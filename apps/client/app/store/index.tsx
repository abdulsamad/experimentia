import { atom, type WritableAtom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { atomWithStorage } from 'jotai/utils';
import dayjs from 'dayjs';

import type { variationsType, supportedLanguagesType, supportedModelsType } from 'utils';

import { settingsKey, threadsKey, lforage } from '@/utils/lforage';

// Editor

export const editorAtom = atom('');

// Chats

export const threadLoadingAtom = atom(false);

export const currentThreadIdAtom = atom(crypto.randomUUID());

export interface IMessageCommons {
  id: string;
  type: 'assistant' | 'user';
  variation: null | variationsType;
  timestamp: number;
  model: supportedModelsType;
}

export interface ITextMessage {
  message: string;
  format: 'text';
}

export interface IImageMessage {
  image: {
    url: string;
    alt: string;
  };
  size: string;
  format: 'image';
}

export type IMessage = IMessageCommons & (ITextMessage | IImageMessage);

export const chatAtom: WritableAtom<IMessage[], IMessage[], void> = atom(
  [],
  (get, set, update, reset) => {
    // Reset current chat
    if (reset) {
      set(chatAtom, update);
      return;
    }

    // Add chat normally
    const state = get(chatAtom);
    const chatIndex = state.findIndex((chat) => chat.id === update.id);

    if (chatIndex !== -1) {
      // Create a new array to trigger re-render
      const newState = [...state];
      newState[chatIndex] = {
        ...update, // Use the entire update object instead of just concatenating messages
      };
      set(chatAtom, newState as any);
    } else {
      set(chatAtom, [...state, update] as any);
    }
  }
);

// Offline storage (Chats & Threads)

export interface IThread {
  id: ReturnType<typeof crypto.randomUUID>;
  thread: IMessage[];
  timestamp: number;
  name: string;
}

export type IThreads = IThread[];

export const chatSaveEffect = atomEffect((get, set) => {
  (async () => {
    const thread = get(chatAtom);
    const threadId = get(currentThreadIdAtom);
    const chatsItem: IThread = {
      id: threadId,
      thread,
      timestamp: dayjs(Date.now()).valueOf(),
      name: `Chat (${dayjs(Date.now()).format('hh:mm - DD/MM/YY')})`,
    };

    let updatedThreads;

    // Return if chats doesn't exist
    if (!thread.length || !threadId) return null;

    const threads: IThreads | null = await lforage.getItem(threadsKey);

    if (!threads) {
      updatedThreads = [chatsItem];
      await lforage.setItem(threadsKey, updatedThreads);
      return;
    }

    if (!Array.isArray(threads)) return null;

    const threadExists = threads.some(({ id }) => id === threadId);

    if (threadExists) {
      updatedThreads = threads.map((thread) => (thread.id === threadId ? chatsItem : thread));
    } else {
      updatedThreads = [chatsItem, ...threads];
    }

    // Save threads
    await lforage.setItem(threadsKey, updatedThreads);
  })();
});

// Flags

// export const configCatClientAtom = atom(
//   configcat.getClient(import.meta.env.NEXT_PUBLIC_CONFIGCAT_API_KEY)
// );

// export const identifierAtom = atom('');

// export const flagsAtom = atom(async (get) => {
//   const identifier = get(identifierAtom);

//   if (identifier) {
//     const userObject = new configcat.User(identifier);
//     const client = get(configCatClientAtom);

//     const gpt4Enabled = await client.getValueAsync('enable-GPT-4', false, userObject);

//     const dallE3Enabled = await client.getValueAsync('enable-DALL-E-3', false, userObject);

//     return {
//       gpt4Enabled,
//       dallE3Enabled,
//     };
//   }

//   return null;
// });

// Config

export interface IConfig {
  model: supportedModelsType;
  variation: variationsType;
  language: supportedLanguagesType;
  imageSize: string;
  textInput: boolean;
  speakResults: boolean;
  quality: 'standard' | 'hd';
  style: 'vivid' | 'natural';
}

export const configAtom = atomWithStorage<IConfig>(settingsKey, {
  model: 'gemini-1.5-flash',
  variation: 'normal',
  language: 'en-IN',
  imageSize: '1024x1024',
  textInput: true,
  speakResults: false,
  quality: 'standard',
  style: 'vivid',
});

// Sidebar
export const sidebarAtom = atom(false);
