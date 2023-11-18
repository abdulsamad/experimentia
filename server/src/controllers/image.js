const configcat = require('configcat-js-ssr');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const configCatClient = configcat.getClient(process.env.CONFIGCAT_API_KEY);

const image = async (req, res) => {
	try {
		const { model, prompt, size = '1024x1024', n = 1 } = req.body;

		let isDallE3Enabled;

		if (!prompt)
			return NextResponse.json(
				{ success: false, err: 'Prompt not found' },
				{ status: 400 },
			);

		if (model === 'dall-e-3') {
			const user = new configcat.User(session.user.email);

			// The default user will be used in the evaluation process.
			isDallE3Enabled = await configCatClient.getValueAsync(
				'enable-DALL-E-3',
				false,
				user,
			);
		}

		const image = await openai.images.generate({
			response_format: 'url',
			model: isDallE3Enabled ? model : 'dall-e-2',
			prompt,
			n,
			size,
		});
		const url = image.data;

		return res.status(200).json({ success: true, url, image });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, err: 'Something went wrong' });
	}
};

module.exports = image;
