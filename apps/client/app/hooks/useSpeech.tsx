import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/react-router';
import axios from 'axios';
import useSound from 'use-sound';

import { supportedImageModels } from 'utils';

import { threadLoadingAtom, chatAtom, configAtom } from '@/store';
import { speechLog, speechGrammer, IS_SPEECH_RECOGNITION_SUPPORTED } from '@/utils';
import { getGeneratedText, getGeneratedImage } from '@/utils/api-calls';

const useSpeech = () => {
  const addChat = useSetAtom(chatAtom);
  const setIsChatResponseLoading = useSetAtom(threadLoadingAtom);
  const { model, variation, imageSize, language, speakResults, quality, style } =
    useAtomValue(configAtom);
  const [isListening, setIsListening] = useState(false);
  const [isPending, startTransition] = useTransition();

  const recognition = useRef<SpeechRecognition | null>(null);

  const { user } = useUser();
  const { getToken } = useAuth();
  // const [play] = useSound('notification.mp3');
  const play = () => null;

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
    if (!recognition.current) return null;

    recognition.current.stop();
    speechLog('Stopped');
    setIsListening(false);
  }, []);

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
          timestamp: dayjs().valueOf(),
          format: 'text',
          model,
        });

        setIsChatResponseLoading(true);
        stopRecognition();

        if (supportedImageModels.includes(model as any)) {
          const { b64_json, image } = await getGeneratedImage({
            prompt: transcript,
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
            prompt: transcript,
            language: recognition.current?.lang,
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
          const timestamp = dayjs().valueOf();
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

          if (speakResults) speakText(content, recognition.current?.lang || 'en-US');
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
    },
    [
      addChat,
      model,
      setIsChatResponseLoading,
      stopRecognition,
      imageSize,
      user,
      quality,
      style,
      variation,
      play,
      speakResults,
      speakText,
    ]
  );

  useEffect(() => {
    if (!IS_SPEECH_RECOGNITION_SUPPORTED()) return;

    const speechRecognition = new (webkitSpeechRecognition || SpeechRecognition)();

    recognition.current = speechRecognition;

    // Add speech grammar
    if (window.webkitSpeechGrammarList || window.SpeechGrammarList) {
      const speechRecognitionList = new (webkitSpeechGrammarList || SpeechGrammarList)();

      speechRecognitionList.addFromString(speechGrammer, 1);
      recognition.current.grammars = speechRecognitionList;
    }

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
  }, [language, onSpeechResult, stopRecognition]);

  return {
    startRecognition,
    stopRecognition,
    recognition,
    isListening,
  };
};

export default useSpeech;
