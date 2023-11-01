export const speechLog = (text: string, styles?: React.CSSProperties) => {
	console.log(
		`%cSPEECH RECOGNITION: %c${text}`,
		'font-size: 12px;font-weight: bold; color: #2196F3;',
		'font-size: 12px;color: #e3e3e3;',
	);
};
