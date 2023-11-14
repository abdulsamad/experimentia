import { getConfig } from './config';

export const speechLog = (text: string, styles?: React.CSSProperties) => {
	console.log(
		`%cSPEECH RECOGNITION: %c${text}`,
		'font-size: 12px;font-weight: bold; color: #2196F3;',
		'font-size: 12px;color: #e3e3e3;',
	);
};

export const speechGrammer =
	'#JSGF V1.0; grammar colors; public <color> = aqua | azure | black | orange ;';

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
