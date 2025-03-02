import { useCallback, useLayoutEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { getTime } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@clerk/react-router';

import { threadLoadingAtom, threadAtom, configAtom, editorAtom } from '@/store/index';

import useHandleChatResponse from './useHandleChatResponse';

const extensions = [
  StarterKit.configure({
    history: false,
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {
        class: 'heading',
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: 'paragraph',
      },
    },
  }),
  Placeholder.configure({
    placeholder: 'Ask any thing or discuss...',
  }),
];

const useCustomEditor = () => {
  const [editorState, setEditorState] = useAtom(editorAtom);
  const addChat = useSetAtom(threadAtom);
  const setIsChatResponseLoading = useSetAtom(threadLoadingAtom);
  const { variation, model, imageSize, language, quality, style } = useAtomValue(configAtom);

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'w-full h-[50px] p-3 box-border' },
      handleDOMEvents: {
        keydown: (view, ev) => {
          if (ev.key.toLowerCase() === 'enter') {
            ev.preventDefault();

            // TODO: Fix directly accessing DOM
            document.getElementById('text-submit-btn')?.click();
          }
        },
      },
    },
    onUpdate({ editor }) {
      setEditorState(editor.getHTML());
    },
  });
  const { user } = useUser();
  const { handleChatResponse } = useHandleChatResponse();

  useLayoutEffect(() => {
    if (!editor) return;

    const cursorPos = editor.state.selection.$head.pos;

    editor?.commands?.clearContent();
    editor?.commands.insertContent(editorState);

    // Reset cursor position after inserting content
    editor.chain().focus().setTextSelection(cursorPos).run();
  }, [editorState, editor]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!editor?.getText()?.trim()) return null;

      addChat({
        id: crypto.randomUUID(),
        type: 'user',
        message: editor?.getText(),
        variation: null,
        timestamp: getTime(new Date()),
        format: 'text',
        model,
      });

      setIsChatResponseLoading(true);
      setEditorState('');

      await handleChatResponse({
        prompt: editor.getText(),
      });

      return true;
    } catch (err) {
      toast.error('Something went Wrong!');
    } finally {
      setIsChatResponseLoading(false);
    }
  }, [
    editor,
    addChat,
    model,
    setIsChatResponseLoading,
    setEditorState,
    imageSize,
    user,
    quality,
    style,
    variation,
    language,
  ]);

  return { editor, handleSubmit };
};

export default useCustomEditor;
