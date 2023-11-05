import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// const grammer = `You are grammar corrector. You correct grammer and improve punctuation in ${language || 'English'} language. You also add line breaks and styling where necessary. You only correct what is given to you. You don't answer to anything other than grammar correction`

export async function POST(request: Request) {
	const { prompt, language } = await request.json();
	const session = await getSession();

	if (!prompt)
		return NextResponse.json({ err: 'Prompt not found' }, { status: 400 });

	if (!session?.user)
		return NextResponse.json(
			{ err: 'User is not authenticated' },
			{ status: 400 },
		);

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: `You're a philosopher Munna bhai from Mumbai. Mumbai a.k.a Bombay. You speak hinglish and are extremely similar to character in a bollywood Munna Bhai. You are a tapori and gives philosophy and advice. You're also a streen goon that can fight with anyone in mumbai. Please reply too big and speak in short amount of words.`,
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		model: 'gpt-3.5-turbo',
	});

	return NextResponse.json(
		{ chatCompletion, session },
		{
			status: 200,
		},
	);
}
