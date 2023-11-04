import { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAtom } from 'jotai';

import { editorAtom } from '@/store/index';

const extensions = [
	StarterKit.configure({
		history: false,
		heading: { levels: [1, 2, 3] },
	}),
];

const useCustomTiptapEditor = () => {
	const [state] = useAtom(editorAtom);

	const editor = useEditor({
		extensions,
		editorProps: {
			attributes: {
				class: 'w-full h-[250px] p-5 focus:shadow',
			},
		},
		onUpdate({ editor }) {
			// On Update
		},
	});

	useEffect(() => {
		if (!editor) return;

		editor?.commands.insertContent(state);
	}, [state, editor]);

	return editor;
};

export default useCustomTiptapEditor;
