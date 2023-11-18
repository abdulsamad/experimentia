import axios from 'axios';

import { getConfig } from './config';

const axiosInstance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api`,
});

export const getApiAccessToken = async () => {
	const res = await axios.get('/api/token');
	return res.data.token.access_token;
};

export const getGeneratedText = async (prompt: string, language?: string) => {
	const token = await getApiAccessToken();

	const res = await axiosInstance.post(
		'/text',
		{
			prompt,
			language,
			type: getConfig('variation'),
			model: getConfig('model'),
		},
		{ headers: { Authorization: `Bearer ${token}` } },
	);

	return res.data;
};

export const getGeneratedImage = async (
	prompt: string,
	size = '512x512',
	n = 1,
) => {
	const token = await getApiAccessToken();

	const res = await axiosInstance.post(
		'/image',
		{ prompt, size, n, model: getConfig('model') },
		{ headers: { Authorization: `Bearer ${token}` } },
	);

	return res.data;
};
