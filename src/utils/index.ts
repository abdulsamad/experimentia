export const speechLog = (text: string, styles?: React.CSSProperties) => {
	console.log(
		`%cSPEECH RECOGNITION: %c${text}`,
		'font-size: 12px;font-weight: bold; color: #2196F3;',
		'font-size: 12px;color: #e3e3e3;',
	);
};

export const getCorrectedText = async (prompt: string, language?: string) => {
	const res = await fetch('/api/chat', {
		method: 'POST',
		body: JSON.stringify({
			prompt,
			language,
		}),
	});

	return res.json();
};
