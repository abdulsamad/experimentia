import { atom } from 'jotai';
import * as configcat from 'configcat-js-ssr';

export const editorAtom = atom('', (get, set, update) => {
	set(editorAtom, update);
});

export const chatsAtom = atom([], (get, set, update: object) => {
	const state = get(chatsAtom);

	set(chatsAtom, [...state, update]);
});

// Flags

export const configCatClientAtom = atom(
	configcat.getClient(process.env.NEXT_PUBLIC_CONFIGCAT_API_KEY as string),
);

export const identifierAtom = atom('', (get, set, update) => {
	if (update) {
		set(identifierAtom, update);
	}
});

export const flagsAtom = atom(async (get) => {
	const identifier = get(identifierAtom);

	if (identifier) {
		const userObject = new configcat.User(identifier);
		const client = get(configCatClientAtom);

		const gpt4Enabled = await client.getValueAsync(
			'enable-GPT-4',
			false,
			userObject,
		);

		const normalEnabled = await client.getValueAsync(
			'enable-normal',
			false,
			userObject,
		);

		return {
			gpt4Enabled,
			normalEnabled,
		};
	}

	return null;
});
