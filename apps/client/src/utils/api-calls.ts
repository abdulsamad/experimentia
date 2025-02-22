import axios from 'axios';

import { IConfig } from '@/store/index';

import { getConfig } from './config';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api`,
});

export const getApiAccessToken = async () => {
  const res = await axios.get('/api/token');
  return res.data.token.access_token;
};

interface IGetGeneratedText {
  prompt: string;
  language?: string;
  user: any;
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
}: IGetGeneratedText): Promise<ReadableStream<string> | { success: boolean; err: string }> => {
  const token = await getApiAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
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
}

export const getGeneratedImage = async ({
  prompt,
  user,
  quality,
  style,
  size,
}: IGetGeneratedImage) => {
  const token = await getApiAccessToken();

  const res = await axiosInstance.post(
    '/image',
    { prompt, user, model: getConfig('model'), quality, style, size },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
