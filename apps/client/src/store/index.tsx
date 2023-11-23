import { atom, WritableAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import * as configcat from 'configcat-js-ssr';
import { Dayjs } from 'dayjs';

import { settingsKey } from '@/utils/config';

// Editor

export const editorAtom = atom('');

// Chats

export const chatLoading = atom(false);

interface IChatCommon {
  type: 'assistant' | 'user';
  variation: string | null;
  time: Dayjs;
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

export const chatsAtom: WritableAtom<IChat[], IChat[], void> = atom([], (get, set, update) => {
  const state = get(chatsAtom);
  set(chatsAtom, [...state, update] as any);
});

// Flags

export const configCatClientAtom = atom(
  configcat.getClient(process.env.NEXT_PUBLIC_CONFIGCAT_API_KEY as string)
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
