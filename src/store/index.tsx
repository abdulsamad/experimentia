import { atom } from 'jotai';

export const editorAtom = atom('');

export const chatsAtom = atom([], (get, set, update: object) => {
	const state = get(chatsAtom);

	set(chatsAtom, [...state, update]);
});
