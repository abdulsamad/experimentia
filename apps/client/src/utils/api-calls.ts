import axios from 'axios';

import { getConfig } from './config';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api`,
});

export const getApiAccessToken = async () => {
  const res = await axios.get('/api/token');
  return res.data.token.access_token;
};

interface IgetGeneratedText {
  prompt: string;
  language?: string;
  user: any;
}

/**
 * Streams the generated text from the API
 * @param {prompt, language, user}
 * @returns {Stream}
 */
export const getGeneratedText = async ({ prompt, language, user }: IgetGeneratedText) => {
  const token = await getApiAccessToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/text`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      language,
      type: getConfig('variation'),
      model: getConfig('model'),
      user,
    }),
  });

  return res.body?.pipeThrough(new TextDecoderStream());
};

interface IgetGeneratedImage {
  prompt: string;
  user: any;
  size?: string;
  n?: number;
}

export const getGeneratedImage = async ({
  prompt,
  size = '512x512',
  n = 1,
  user,
}: IgetGeneratedImage) => {
  const token = await getApiAccessToken();

  const res = await axiosInstance.post(
    '/image',
    { prompt, size, n, model: getConfig('model'), user },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
