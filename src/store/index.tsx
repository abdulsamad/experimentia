import { atom } from 'jotai';

export const editorAtom = atom('', (get, set, update) => {
	const state = get(editorAtom);

	set(editorAtom, update);
});
