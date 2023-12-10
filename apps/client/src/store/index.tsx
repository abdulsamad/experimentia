import { atom, WritableAtom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { atomWithStorage } from 'jotai/utils';
import * as configcat from 'configcat-js-ssr';
import dayjs from 'dayjs';

import { variations, supportedLanguages } from 'utils/types';

import { settingsKey, threadsKey, lforage } from '@/utils/config';

// Editor

export const editorAtom = atom('');

// Chats

export const threadLoadingAtom = atom(false);

export const currentThreadIdAtom = atom(crypto.randomUUID());

export interface IMessageCommons {
  id: string;
  type: 'assistant' | 'user';
  variation: null | variations;
  timestamp: number;
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'dall-e-2' | 'dall-e-3';
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
    let chat;

    if (chatIndex !== -1) {
      const prevChat = state[chatIndex] as any;
      state[chatIndex] = { ...prevChat, message: prevChat?.message + (update as any).message };
      chat = state;
    } else {
      chat = [...state, update] as any;
    }

    set(chatAtom, chat);
  }
);

// Offline storage (Chats & Threads)

export interface IThread {
  id: string;
  thread: IMessage[];
  timestamp: number;
  name: string;
}

export type IThreads = IThread[];

export const chatSaveEffect = atomEffect((get, set) => {
  (async () => {
    const thread = get(chatAtom);
    const chatId = get(currentThreadIdAtom);
    const chatsItem: IThread = {
      id: chatId,
      thread,
      timestamp: dayjs(Date.now()).valueOf(),
      name: `Chat (${dayjs(Date.now()).format('hh:mm - DD/MM/YY')})`,
    };

    let updatedThreads;

    // Return if chats doesn't exist
    if (!thread.length || !chatId) return null;

    const threads: IThreads | null = await lforage.getItem('chats');

    if (!threads) {
      updatedThreads = [chatsItem];
      await lforage.setItem(threadsKey, updatedThreads);
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
    await lforage.setItem(threadsKey, updatedThreads);
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

export interface IConfig {
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'dall-e-2' | 'dall-e-3';
  variation: variations;
  language: supportedLanguages;
  imageSize: string;
  textInput: boolean;
  speakResults: boolean;
  quality: 'standard' | 'hd';
  style: 'vivid' | 'natural';
}

export const configAtom = atomWithStorage<IConfig>(settingsKey, {
  model: 'gpt-3.5-turbo',
  variation: 'normal',
  language: 'en-IN',
  imageSize: '1024x1024',
  textInput: false,
  speakResults: false,
  quality: 'standard',
  style: 'vivid',
});

// Sidebar
export const sidebarAtom = atom(false);
