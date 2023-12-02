import { useCallback, useLayoutEffect, useTransition } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

import { chatLoading, chatsAtom, configAtom, editorAtom } from '@/store/index';
import { getGeneratedText, getGeneratedImage } from '@/utils/api-calls';

StarterKit.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.toggleBold(),
    };
  },
});

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
    placeholder: 'Message',
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
        class: 'w-full h-[50px] p-3 box-border focus:shadow',
      },
    },
    onUpdate({ editor }) {
      setState(editor.getHTML());
    },
  });
  const { user } = useUser();

  useLayoutEffect(() => {
    if (!editor) return;

    const cursorPos = editor.state.selection.$head.pos;

    editor?.commands?.clearContent();
    editor?.commands.insertContent(state);

    // Reset cursor position after inserting content
    editor.chain().focus().setTextSelection(cursorPos).run();
  }, [state, editor]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!editor?.getText()?.trim()) return null;

      addChat({
        id: crypto.randomUUID(),
        type: 'user',
        message: editor?.getText(),
        variation,
        time: dayjs(),
        format: 'text',
      });

      setIsChatResponseLoading(true);

      if (['dall-e-2', 'dall-e-3'].includes(model)) {
        const { url, image } = await getGeneratedImage({
          prompt: editor.getText(),
          size: imageSize,
          user,
        });

        startTransition(() => {
          addChat({
            id: crypto.randomUUID(),
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
        const stream = await getGeneratedText({
          prompt: editor.getText(),
          language,
          user,
        });

        if (!stream) throw new Error();

        const reader = stream.getReader();
        const uid = crypto.randomUUID();
        let content = '';

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            // Stream is completed
            console.log('DONE');
            break;
          }

          content += value;
          console.log(value);
        }

        startTransition(() => {
          addChat({
            id: uid,
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
      if (axios.isAxiosError(err)) {
        return toast.error(err.response?.data.err, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }

      toast.error('Something went Wrong!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setIsChatResponseLoading(false);
    }
  }, [
    addChat,
    editor,
    imageSize,
    language,
    model,
    setIsChatResponseLoading,
    setState,
    user,
    variation,
  ]);

  return { editor, handleSubmit };
};

export default useCustomTiptapEditor;
