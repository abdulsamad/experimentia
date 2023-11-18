import axios from 'axios';

import { getConfig } from './config';

export const getGeneratedText = async (prompt: string, language?: string) => {
	const res = await axios.post('/api/text', {
		prompt,
		language,
		type: getConfig('variation'),
		model: getConfig('model'),
	});

	return res.data;
};

export const getGeneratedImage = async (
	prompt: string,
	size = '512x512',
	n = 1,
) => {
	const res = await axios.post('/api/image', {
		prompt,
		size,
		n,
		model: getConfig('model'),
	});

	return res.data;
};
