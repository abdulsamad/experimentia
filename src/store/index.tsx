import { atom, createStore } from 'jotai';

const store = createStore();

export const editorAtom = atom('', (get, set, update) => {
	const state = get(editorAtom);

	set(editorAtom, update);
});

export default store;
