import { getConfig } from './config';

export const getGeneratedText = async (prompt: string, language?: string) => {
	const res = await fetch('/api/text', {
		method: 'POST',
		body: JSON.stringify({
			prompt,
			language,
			type: getConfig('variation'),
			model: getConfig('model'),
		}),
	});

	return res.json();
};

export const getGeneratedImage = async (
	prompt: string,
	size = '512x512',
	n = 1,
) => {
	const res = await fetch('/api/image', {
		method: 'POST',
		body: JSON.stringify({
			prompt,
			size,
			n,
			model: getConfig('model'),
		}),
	});

	return res.json();
};
