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
