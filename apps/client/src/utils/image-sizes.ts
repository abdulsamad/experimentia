const imageSizes = (model: string) => {
	if (model === 'dall-e-3') {
		return {
			default: '1024x1024',
			options: ['1024x1024', '1024x1792', '1792x1024'],
		};
	}

	return {
		default: '256x256',
		options: ['256x256', '512x512', '1024x1024'],
	};
};

export default imageSizes;
