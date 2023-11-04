import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
	const { prompt, language } = await request.json();

	if (!prompt) return NextResponse.json({ err: 'Prompt not found' });

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You are grammar corrector and mind blowind speech writer. You correct grammer and improve punctuation in ${
					language || 'English'
				} language. Also add line breaks and styling where necessary. You only correct what is given to you and improvise the sentences that's it`,
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		model: 'gpt-3.5-turbo',
	});

	return NextResponse.json(
		{ chatCompletion },
		{
			status: 200,
		},
	);
}
