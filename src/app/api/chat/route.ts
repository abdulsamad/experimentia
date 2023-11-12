import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';

import { systemMapper } from './utils';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
	const { prompt, language, type } = await request.json();
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
				content: systemMapper(type, language).prompt,
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		model: systemMapper(type, language).model,
	});

	return NextResponse.json(
		{ chatCompletion, session },
		{
			status: 200,
		},
	);
}
