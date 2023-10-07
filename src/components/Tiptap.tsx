'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const Tiptap = () => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				history: false,
				heading: {
					levels: [1, 2, 3],
				},
			}),
		],
		content: `<p>Hello World! 🌎️</p><br /><h1>This is a 1st level heading</h1>`,
		editorProps: {
			attributes: {
				class: 'w-full h-[250px] p-3',
			},
		},
	});

	return (
		<div>
			<div className='border border-solid border-slate-200 rounded-lg'>
				<EditorContent editor={editor} />
			</div>
		</div>
	);
};

export default Tiptap;
