const configcat = require('configcat-js-ssr');
const OpenAI = require('openai');
require('dotenv').config();

const promptMapper = require('../utils/chat-utils');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const configCatClient = configcat.getClient(process.env.CONFIGCAT_API_KEY);

const chat = async (req, res) => {
	try {
		const { prompt, language, type, model } = req.body;

		let isGPT4Enabled;

		if (!prompt) {
			return res.status(400).json({ success: false, err: 'Prompt not found' });
		}

		if (model === 'gpt-4') {
			const user = new configcat.User(session.user.email);
			isGPT4Enabled = await configCatClient.getValueAsync(
				'enable-GPT-4',
				false,
				user,
			);
		}

		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{ role: 'system', content: promptMapper(type, language).prompt },
				{ role: 'user', content: prompt },
			],
			model: isGPT4Enabled ? model || 'gpt-3.5-turbo' : 'gpt-3.5-turbo',
		});

		const { choices } = chatCompletion;

		return res.status(200).json({
			success: true,
			chatCompletion,
			content: choices[0]?.message?.content,
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, err: 'Something went wrong' });
	}
};

module.exports = chat;
