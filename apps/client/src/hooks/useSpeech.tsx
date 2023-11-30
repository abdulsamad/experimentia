import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

import { chatLoading, chatsAtom, configAtom } from '@/store';
import { speechLog, speechGrammer } from '@/utils';
import { getGeneratedText, getGeneratedImage } from '@/utils/api-calls';

const useSpeech = () => {
  const addChat = useSetAtom(chatsAtom);
  const setIsChatResponseLoading = useSetAtom(chatLoading);
  const { model, variation, imageSize, language, speakResults } = useAtomValue(configAtom);
  const [isListening, setIsListening] = useState(false);
  const [isPending, startTransition] = useTransition();

  const recognition = useRef<SpeechRecognition | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const speechRecognition = new (webkitSpeechRecognition || SpeechRecognition)();
    const speechRecognitionList = new webkitSpeechGrammarList();

    speechRecognitionList.addFromString(speechGrammer, 1);

    recognition.current = speechRecognition;
    recognition.current.grammars = speechRecognitionList;
    recognition.current.continuous = true;
    recognition.current.lang = language;
    recognition.current.interimResults = false;
    recognition.current.maxAlternatives = 1;
    recognition.current.onaudiostart = () => speechLog('Audio Started');
    recognition.current.onaudioend = () => speechLog('Audio Ended');
    recognition.current.onspeechstart = () => speechLog('Speech Started');
    recognition.current.onspeechend = stopRecognition;
    recognition.current.onresult = onSpeechResult;
    recognition.current.onnomatch = () => speechLog('No Match');
    recognition.current.onstart = () => speechLog('Start');
    recognition.current.onerror = () => speechLog('Error');
    recognition.current.onend = () => speechLog('End');

    return () => {
      stopRecognition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const startRecognition = useCallback(async () => {
    if (!recognition.current) return null;

    try {
      // await navigator.mediaDevices.getUserMedia({ audio: true });

      recognition.current.start();
      setIsListening(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const stopRecognition = useCallback(async () => {
    if (!recognition.current || !isListening) return null;

    recognition.current.stop();
    speechLog('Stopped');
    setIsListening(false);
  }, [isListening]);

  const onSpeechResult = useCallback(
    async (ev: SpeechRecognitionEvent) => {
      try {
        const results = ev.results;
        const last = --Object.keys(results).length;

        // TODO: Clean log results
        console.log(results);

        const transcript = results[last][0].transcript;

        if (!transcript.trim()) return null;

        addChat({
          id: crypto.randomUUID(),
          type: 'user',
          message: transcript,
          variation: null,
          time: dayjs(),
          format: 'text',
        });

        setIsChatResponseLoading(true);

        if (['dall-e-2', 'dall-e-3'].includes(model)) {
          const { url, image } = await getGeneratedImage({
            prompt: transcript,
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
          });
        } else {
          const stream = await getGeneratedText({
            prompt: transcript,
            language: recognition.current?.lang,
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
          });

          if (speakResults) speakText(content, recognition.current?.lang || 'en-US');
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addChat, imageSize, model, setIsChatResponseLoading, user, variation]
  );

  const speakText = useCallback((text: string, language: string) => {
    // Check if the browser supports the Web Speech API
    if ('speechSynthesis' in window) {
      // Create a SpeechSynthesisUtterance object
      const utterance = new SpeechSynthesisUtterance();

      // Set the utterance text and language
      utterance.text = text;
      utterance.lang = language;

      // Speak the utterance
      speechSynthesis.speak(utterance);
    } else {
      console.error('SpeechSynthesis API not supported');
    }
  }, []);

  return {
    startRecognition,
    stopRecognition,
    recognition,
    isListening,
  };
};

export default useSpeech;
