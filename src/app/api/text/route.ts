import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import * as configcat from 'configcat-js-ssr';

import { promptMapper } from './utils';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const configCatClient = configcat.getClient(
	process.env.NEXT_PUBLIC_CONFIGCAT_API_KEY as string,
);

export async function POST(request: Request) {
	const { prompt, language, type, model } = await request.json();
	const session = await getSession();
	let isGPT4Enabled;

	if (!prompt)
		return NextResponse.json({ err: 'Prompt not found' }, { status: 400 });

	if (!session?.user)
		return NextResponse.json(
			{ err: 'User is not authenticated' },
			{ status: 400 },
		);

	if (model === 'gpt-4') {
		const user = new configcat.User(session.user.email);

		// The default user will be used in the evaluation process.
		isGPT4Enabled = await configCatClient.getValueAsync(
			'enable-GPT-4',
			false,
			user,
		);
	}

	const chatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: promptMapper(type, language).prompt,
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		model: isGPT4Enabled ? model || 'gpt-3.5-turbo' : 'gpt-3.5-turbo',
	});
	const { choices } = chatCompletion;

	return NextResponse.json(
		{ chatCompletion, content: choices[0]?.message?.content },
		{
			status: 200,
		},
	);
}
