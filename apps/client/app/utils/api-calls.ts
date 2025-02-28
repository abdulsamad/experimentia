import axios from 'axios';
import { useAuth } from '@clerk/react-router';

import { IConfig } from '@/store/index';

import { getConfig } from './config';

const baseURL = import.meta.env.VITE_API_ENDPOINT;
const axiosInstance = axios.create({ baseURL });

type GetTokenOptions = Parameters<ReturnType<typeof useAuth>['getToken']>[0];

interface IGetGeneratedText {
  prompt: string;
  language?: string;
  user: any;
  getToken: (options?: GetTokenOptions) => Promise<string | null>;
}

/**
 * Streams the generated text from the API
 * @param {prompt, language, user}
 * @returns {Stream}
 */
export const getGeneratedText = async ({
  prompt,
  language,
  user,
  getToken,
}: IGetGeneratedText): Promise<ReadableStream<string> | { success: boolean; err: string }> => {
  const token = await getToken();

  const res = await fetch(`${baseURL}/chat`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      language,
      variation: getConfig('variation'),
      model: getConfig('model'),
      user,
    }),
  });

  if (!res.ok || !res.body) {
    const err = await res.json();
    return err;
  }

  return res.body.pipeThrough(new TextDecoderStream());
};

interface IGetGeneratedImage {
  prompt: string;
  user: any;
  quality: IConfig['quality'];
  style: IConfig['style'];
  size?: string;
  getToken: (options?: GetTokenOptions) => Promise<string | null>;
}

export const getGeneratedImage = async ({
  prompt,
  user,
  quality,
  style,
  size,
  getToken,
}: IGetGeneratedImage) => {
  const token = await getToken();

  const res = await axiosInstance.post(
    '/image',
    { prompt, user, model: getConfig('model'), quality, style, size },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
