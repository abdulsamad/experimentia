'use client';

import { EditorContent } from '@tiptap/react';

import useCustomTiptapEditor from '@/hooks/useCustomTiptapEditor';
import useSpeech from '@/hooks/useSpeech';

const Editor = () => {
	const editor = useCustomTiptapEditor();
	const { startRecognition, stopRecognition, isListening } = useSpeech({
		editor,
	});

	const toggleClasses = isListening
		? 'bg-purple-500 text-slate-50 shadow-xl shadow-primary'
		: '';

	return (
		<div>
			<div className='border border-slate-400 rounded-2xl h-[250px]'>
				<EditorContent editor={editor} />
			</div>
			<div className='py-5 flex justify-center gap-4'>
				<button
					className={`absolute bottom-0 right-0 m-5 p-3 bg-primary rounded-full hover:text-gray-300 hover:shadow-xl hover:shadow-slate-700 ${toggleClasses}`}
					onClick={isListening ? stopRecognition : startRecognition}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'>
						<path d='M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z' />
						<path d='M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z' />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Editor;
