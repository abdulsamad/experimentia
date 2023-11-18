import axios from 'axios';

import { getConfig } from './config';

const axiosInstance = axios.create({
	baseURL: '/api',
});

export const getGeneratedText = async (prompt: string, language?: string) => {
	const res = await axiosInstance.post('/text', {
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
	const res = await axiosInstance.post('/image', {
		prompt,
		size,
		n,
		model: getConfig('model'),
	});

	return res.data;
};
