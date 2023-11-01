import { Extension } from '@tiptap/core';

export interface TextAlignOptions {
	types: string[];
	alignments: string[];
	defaultAlignment: string;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		textAlign: {
			/**
			 * Set the text align attribute
			 */
			setTextAlign: (alignment: string) => ReturnType;
			/**
			 * Unset the text align attribute
			 */
			unsetTextAlign: () => ReturnType;
		};
	}
}

export const TextAlign = Extension.create<TextAlignOptions>({
	name: 'uuid',

	addOptions() {
		return {
			types: [],
			alignments: ['left', 'center', 'right', 'justify'],
			defaultAlignment: 'left',
		};
	},

	onUpdate({ editor }) {
		// The content has changed.
		// console.log({ editor });
	},

	onTransaction({ editor, transaction }) {
		// The editor state has changed.
		// const trans = editor.state.tr;
		// const updatedHeadingNode = transaction.steps.find((step: any) => {
		// 	return step.type === 'updateNode' && step.pos === 10;
		// }).updatedNode;
		if (!transaction.docChanged) return;

		console.log({
			editor,
			transaction,
			test: transaction.doc.content,
		});
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					textAlign: {
						default: this.options.defaultAlignment,
						parseHTML: (element) =>
							element.style.textAlign || this.options.defaultAlignment,
						renderHTML: (attributes) => {
							if (attributes.textAlign === this.options.defaultAlignment) {
								return {};
							}

							return { style: `text-align: ${attributes.textAlign}` };
						},
					},
				},
			},
		];
	},

	addCommands() {
		return {
			setTextAlign:
				(alignment: string) =>
				({ commands }) => {
					if (!this.options.alignments.includes(alignment)) {
						return false;
					}

					return this.options.types.every((type) =>
						commands.updateAttributes(type, { textAlign: alignment }),
					);
				},

			unsetTextAlign:
				() =>
				({ commands }) => {
					return this.options.types.every((type) =>
						commands.resetAttributes(type, 'textAlign'),
					);
				},
		};
	},

	addKeyboardShortcuts() {
		return {
			'Mod-Shift-l': () => this.editor.commands.setTextAlign('left'),
			'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
			'Mod-Shift-r': () => this.editor.commands.setTextAlign('right'),
			'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
		};
	},
});

export default TextAlign;
