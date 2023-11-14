import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { chatLoading, chatsAtom } from '@/store';
import {
	speechLog,
	getGeneratedText,
	speechGrammer,
	getGeneratedImage,
} from '@/utils';
import { getConfig } from '@/utils/config';

const useSpeech = () => {
	const addChat = useSetAtom(chatsAtom);
	const setIsChatResponseLoading = useSetAtom(chatLoading);
	const [isListening, setIsListening] = useState(false);
	const [isPending, startTransition] = useTransition();

	const recognition = useRef<SpeechRecognition | null>(null);

	useEffect(() => {
		const speechRecognition = new (webkitSpeechRecognition ||
			SpeechRecognition)();
		const speechRecognitionList = new webkitSpeechGrammarList();

		speechRecognitionList.addFromString(speechGrammer, 1);

		recognition.current = speechRecognition;
		recognition.current.grammars = speechRecognitionList;
		recognition.current.continuous = true;
		recognition.current.lang = getConfig('language') || 'en-IN';
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
			//
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
					type: 'user',
					message: transcript,
					variation: null,
					time: dayjs(),
					format: 'text',
				});

				setIsChatResponseLoading(true);

				if (['dall-e-2', 'dall-e-3'].includes(getConfig('model'))) {
					const { url, image } = await getGeneratedImage(
						transcript,
						getConfig('image-size'),
					);

					startTransition(() => {
						addChat({
							type: 'assistant',
							image: {
								url: url[0].url,
								alt: url[0]?.revised_prompt,
							},
							variation: getConfig('variation') || 'normal',
							time: dayjs(),
							format: 'image',
						});

						setIsChatResponseLoading(false);
					});
				} else {
					const { content } = await getGeneratedText(
						transcript,
						recognition.current?.lang,
					);

					startTransition(() => {
						addChat({
							type: 'assistant',
							message: content,
							variation: getConfig('variation') || 'normal',
							time: dayjs(),
							format: 'text',
						});

						setIsChatResponseLoading(false);
					});

					speakText(content, recognition.current?.lang || 'en-US');
				}
			} catch (err) {
				setIsChatResponseLoading(false);
				toast.error('Something went Wrong!', {
					position: toast.POSITION.BOTTOM_RIGHT,
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[addChat],
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
