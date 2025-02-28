import localforage from 'localforage';

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
  name: 'experimentia',
  description: 'A chat application',
  version: 1.0,
});
