import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import * as configcat from 'configcat-js-ssr';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const configCatClient = configcat.getClient(
	process.env.NEXT_PUBLIC_CONFIGCAT_API_KEY as string,
);

export async function POST(request: Request) {
	try {
		const { model, prompt, size = '1024x1024', n = 1 } = await request.json();
		const session = await getSession();
		let isDallE3Enabled;

		if (!prompt)
			return NextResponse.json(
				{ success: false, err: 'Prompt not found' },
				{ status: 400 },
			);

		if (!session?.user)
			return NextResponse.json(
				{ success: false, err: 'User is not authenticated' },
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

		const image = await (openai.images as any).generate({
			response_format: 'url',
			model: isDallE3Enabled ? model : 'dall-e-2',
			prompt,
			n,
			size,
		});
		const url = image.data;

		return NextResponse.json({ success: true, url, image }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ success: false, err }, { status: 500 });
	}
}
