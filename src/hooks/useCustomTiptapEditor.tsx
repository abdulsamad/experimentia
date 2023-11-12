import { useCallback, useEffect, useTransition, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAtom, useSetAtom } from 'jotai';
import dayjs from 'dayjs';

import { chatsAtom, editorAtom } from '@/store/index';
import { getCorrectedText } from '@/utils';
import { getConfig } from '@/utils/config';

const extensions = [
	StarterKit.configure({
		history: false,
		heading: {
			levels: [1, 2, 3],
			HTMLAttributes: {
				class: 'tt-heading',
			},
		},
	}),
];

const useCustomTiptapEditor = () => {
	const [state, setState] = useAtom(editorAtom);
	const addChat = useSetAtom(chatsAtom);
	const [loading, setLoading] = useState(false);
	const [isPending, startTransition] = useTransition();

	const editor = useEditor({
		extensions,
		editorProps: {
			attributes: {
				class: 'w-full h-[80px] p-3 border-box focus:shadow',
			},
		},
		onUpdate({ editor }) {
			setState(editor.getHTML());
		},
	});

	useEffect(() => {
		if (!editor) return;

		editor?.commands.setContent(state);
	}, [state, editor]);

	const handleSubmit = useCallback(async () => {
		try {
			setLoading(true);

			addChat({
				type: 'user',
				message: editor?.getText(),
				variation: getConfig('variation' || 'normal'),
				time: dayjs(),
			});

			const { chatCompletion } = await getCorrectedText(
				editor?.getText() as string,
				getConfig('language') || 'en-IN',
			);

			const { choices } = chatCompletion;
			const reply = choices[0]?.message?.content;

			startTransition(() => {
				addChat({
					type: 'assistant',
					message: reply,
					variation: getConfig('variation') || 'normal',
					time: dayjs(),
				});

				setLoading(false);
				setState('');
			});
		} catch (err) {
			setLoading(false);
		}
	}, [addChat, editor, setState]);

	return { editor, handleSubmit, loading };
};

export default useCustomTiptapEditor;
