import { useCallback, useEffect, useTransition, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAtom, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { chatLoading, chatsAtom, editorAtom } from '@/store/index';
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
	const setIsChatResponseLoading = useSetAtom(chatLoading);
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

		editor?.commands?.clearContent();
		editor?.commands.insertContent(state);
	}, [state, editor]);

	const handleSubmit = useCallback(async () => {
		try {
			addChat({
				type: 'user',
				message: editor?.getText() as string,
				variation: getConfig('variation' || 'normal'),
				time: dayjs(),
			});

			setIsChatResponseLoading(true);

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

				setIsChatResponseLoading(false);
				setState('');
				editor?.commands?.clearContent();
			});
		} catch (err) {
			setIsChatResponseLoading(false);
			toast.error('Something went Wrong!', {
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
	}, [addChat, editor, setIsChatResponseLoading, setState]);

	return { editor, handleSubmit };
};

export default useCustomTiptapEditor;
