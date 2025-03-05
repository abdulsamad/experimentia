import { useTransition } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { getTime } from 'date-fns';
import { useAuth, useUser } from '@clerk/react-router';
import { toast } from 'sonner';
import axios from 'axios';
import useSound from 'use-sound';

import { supportedImageModels } from 'utils';

import { threadLoadingAtom, threadAtom, configAtom } from '@/store/index';
import { getGeneratedText, getGeneratedImage } from '@/utils/api-calls';

interface handleChatResponseProps {
  prompt: string;
  onTextMessageComplete?: (content: string) => void;
  onImageMessageComplete?: () => void;
}

const useHandleChatResponse = () => {
  const addChat = useSetAtom(threadAtom);
  const setIsChatResponseLoading = useSetAtom(threadLoadingAtom);
  const { variation, model, imageSize, language, quality, style } = useAtomValue(configAtom);
  const [isPending, startTransition] = useTransition();

  const { user } = useUser();
  const { getToken } = useAuth();
  const [play] = useSound('notification.mp3');

  const handleChatResponse = async ({
    prompt,
    onTextMessageComplete,
    onImageMessageComplete,
  }: handleChatResponseProps) => {
    try {
      if (supportedImageModels.map(({ name }) => name).includes(model)) {
        const { b64_json, image } = await getGeneratedImage({
          prompt,
          size: imageSize,
          user,
          quality,
          style,
          getToken,
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
            timestamp: getTime(new Date()),
            format: 'image',
            size: imageSize,
            model,
          });

          setIsChatResponseLoading(false);
          // Haptic feedback and sound
          navigator.vibrate(100);
          play();
        });

        if (onImageMessageComplete) onImageMessageComplete();
      } else {
        const stream = await getGeneratedText({
          prompt,
          language,
          user,
          getToken,
        });

        if (!stream) throw new Error();

        // Handle error response
        if ('success' in stream && !stream.success) {
          throw new Error(stream.err);
        }

        const reader = (stream as ReadableStream<string>).getReader();

        const uid = crypto.randomUUID();
        const timestamp = getTime(new Date());
        let content = '';

        // Close Loader
        startTransition(() => {
          setIsChatResponseLoading(false);
        });

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            // Stream is completed
            navigator.vibrate(100);
            play();
            startTransition(() => {
              addChat({
                id: uid,
                type: 'assistant',
                message: content,
                variation,
                timestamp,
                format: 'text',
                model,
              });
            });
            console.log('%cDONE', 'font-size:12px;font-weight:bold;color:aqua');
            break;
          }

          content += value;

          // Update chat with accumulated content on each chunk
          startTransition(() => {
            addChat({
              id: uid,
              type: 'assistant',
              message: content,
              variation,
              timestamp,
              format: 'text',
              model,
            });
          });
        }

        if (onTextMessageComplete) onTextMessageComplete(content);
      }
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        return toast.error(err.response?.data.err || err.message);
      }

      toast.error('Something went Wrong!');
    }
  };

  return { handleChatResponse, isPending };
};

export default useHandleChatResponse;
