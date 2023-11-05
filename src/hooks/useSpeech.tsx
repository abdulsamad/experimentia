import { useState, useEffect, useRef, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { Editor } from '@tiptap/react';

import { editorAtom } from '@/store';
import { speechLog, getCorrectedText, speechGrammer } from '@/utils';

const useSpeech = ({ editor }: { editor: Editor | null }) => {
	const setEditorState = useSetAtom(editorAtom);
	const [isListening, setIsListening] = useState(false);

	const recognition = useRef<SpeechRecognition | null>(null);

	useEffect(() => {
		const speechRecognition = new (webkitSpeechRecognition ||
			SpeechRecognition)();
		const speechRecognitionList = new webkitSpeechGrammarList();

		speechRecognitionList.addFromString(speechGrammer, 1);

		recognition.current = speechRecognition;
		recognition.current.grammars = speechRecognitionList;
		recognition.current.continuous = true;
		recognition.current.lang = 'en-IN';
		recognition.current.interimResults = false;
		recognition.current.maxAlternatives = 1;
		recognition.current.onresult = onSpeechResult;
		recognition.current.onspeechend = stopRecognition;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const startRecognition = useCallback(async () => {
		if (!recognition.current) return null;

		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });

			recognition.current.start();
			speechLog('Started');
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
			const results = ev.results;
			const len = Object.keys(results).length;

			// TODO: Clean log results
			console.log(results);

			const transcript = results[len - 1][0].transcript;
			setEditorState(transcript);

			const { chatCompletion } = await getCorrectedText(
				transcript,
				recognition.current?.lang,
			);

			const { choices } = chatCompletion;

			setEditorState(
				`<br/><b>Corrected:</b><em>${choices[0]?.message?.content}</em><br/>`,
			);

			console.log({ chatCompletion });
		},
		[setEditorState],
	);

	return {
		startRecognition,
		stopRecognition,
		recognition,
		isListening,
	};
};

export default useSpeech;
