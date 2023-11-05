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
				content: `You are grammar corrector. You correct grammer and improve punctuation in ${
					language || 'English'
				} language. You also add line breaks and styling where necessary. You only correct what is given to you. You don't answer to anything other than grammar correction`,
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
