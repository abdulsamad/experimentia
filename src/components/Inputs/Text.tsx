import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useAtomValue } from 'jotai';

import { chatLoading } from '@/store';
import useCustomTiptapEditor from '@/hooks/useCustomTiptapEditor';

const Text = () => {
	const { editor, handleSubmit } = useCustomTiptapEditor();
	const isChatResponseLoading = useAtomValue(chatLoading);

	return (
		<div className='flex gap-5 items-center p-5'>
			<div className='flex-1 border border-slate-400 rounded-2xl h-[80px] overflow-x-auto'>
				<EditorContent editor={editor} />
			</div>
			<div className=''>
				<button
					className='p-3 bg-primary text-white rounded-full flex items-center justify-center hover:text-gray-300 hover:shadow-xl'
					onClick={handleSubmit}
					disabled={isChatResponseLoading}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'
						aria-hidden={true}>
						<path d='M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z' />
					</svg>
					<span className='sr-only'>Send</span>
				</button>
			</div>
		</div>
	);
};

export default Text;
