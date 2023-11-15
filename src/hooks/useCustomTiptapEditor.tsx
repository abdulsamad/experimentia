import { useCallback, useEffect, useTransition } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { chatLoading, chatsAtom, configAtom, editorAtom } from '@/store/index';
import { getGeneratedImage, getGeneratedText } from '@/utils';

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
	const { variation, model, imageSize, language } = useAtomValue(configAtom);
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
			if (!editor?.getText()?.trim()) return null;

			addChat({
				type: 'user',
				message: editor?.getText(),
				variation,
				time: dayjs(),
				format: 'text',
			});

			setIsChatResponseLoading(true);

			if (['dall-e-2', 'dall-e-3'].includes(model)) {
				const { url, image } = await getGeneratedImage(
					editor.getText(),
					imageSize,
				);

				startTransition(() => {
					addChat({
						type: 'assistant',
						image: {
							url: url[0].url,
							alt: url[0]?.revised_prompt,
						},
						variation,
						time: dayjs(),
						format: 'image',
					});

					setIsChatResponseLoading(false);
					setState('');
					editor?.commands?.clearContent();
				});
			} else {
				const { content } = await getGeneratedText(editor.getText(), language);

				startTransition(() => {
					addChat({
						type: 'assistant',
						message: content,
						variation,
						time: dayjs(),
						format: 'text',
					});

					setIsChatResponseLoading(false);
					setState('');
					editor?.commands?.clearContent();
				});
			}
		} catch (err) {
			setIsChatResponseLoading(false);
			toast.error('Something went Wrong!', {
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
	}, [
		addChat,
		editor,
		imageSize,
		language,
		model,
		setIsChatResponseLoading,
		setState,
		variation,
	]);

	return { editor, handleSubmit };
};

export default useCustomTiptapEditor;
