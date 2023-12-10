import { useCallback, useLayoutEffect, useTransition } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { useSound } from 'use-sound';

import { chatLoadingAtom, chatAtom, configAtom, editorAtom } from '@/store/index';
import { getGeneratedText, getGeneratedImage } from '@/utils/api-calls';

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

const useCustomTiptapEditor = () => {
  const [editorState, setEditorState] = useAtom(editorAtom);
  const addChat = useSetAtom(chatAtom);
  const setIsChatResponseLoading = useSetAtom(chatLoadingAtom);
  const { variation, model, imageSize, language, quality, style } = useAtomValue(configAtom);
  const [isPending, startTransition] = useTransition();

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: { class: 'w-full h-[50px] p-3 box-border' },
      handleDOMEvents: {
        keydown: (view, ev) => {
          if (ev.metaKey && ev.key.toLowerCase() === 'enter') {
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
  const [play] = useSound('notification.mp3');

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
        timestamp: dayjs().valueOf(),
        format: 'text',
        model,
      });

      setIsChatResponseLoading(true);
      setEditorState('');

      if (['dall-e-2', 'dall-e-3'].includes(model)) {
        const { b64_json, image } = await getGeneratedImage({
          prompt: editor.getText(),
          size: imageSize,
          user,
          quality,
          style,
        });

        startTransition(() => {
          addChat({
            id: crypto.randomUUID(),
            type: 'assistant',
            image: {
              url: `data:image/png;base64,${b64_json}`,
              alt: image.data[0]?.revised_prompt,
            },
            variation,
            timestamp: dayjs().valueOf(),
            format: 'image',
            size: imageSize,
            model,
          });

          setIsChatResponseLoading(false);
          // Haptic feedback and sound
          navigator.vibrate(100);
          play();
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
            timestamp: dayjs().valueOf(),
            format: 'text',
            model,
          });

          setIsChatResponseLoading(false);
          // Haptic feedback and sound
          navigator.vibrate(100);
          play();
        });
      }
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        return toast.error(err.response?.data.err);
      }

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
    play,
    language,
  ]);

  return { editor, handleSubmit };
};

export default useCustomTiptapEditor;
