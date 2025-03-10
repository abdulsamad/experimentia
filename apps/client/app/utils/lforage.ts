import localforage from 'localforage';

import { IThreads } from '@/store';

export const settingsKey = 'config';

export const getConfig = (setting: string) => {
  if (!window) return null;

  if (setting) {
    const settings = localStorage.getItem(settingsKey);
    const config = settings ? JSON.parse(settings)[setting] : null;
    return config;
  }

  const settings = localStorage.getItem(settingsKey);
  const config = settings ? JSON.parse(settings) : null;
  return config;
};

export const threadsKey = 'threads';

export const lforage = localforage.createInstance({
  name: 'polychat',
  description: 'A chat application',
  version: 1.0,
});

export const getThreads = async (): Promise<IThreads> => {
  const threads = (await lforage.getItem(threadsKey)) as IThreads;
  return threads;
};
