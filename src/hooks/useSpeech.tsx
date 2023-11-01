import { useState, useEffect, useRef, useCallback } from 'react';
import { useAtom } from 'jotai';

import { editorAtom } from '@/atoms';
import { speechLog } from '@/utils';

const useSpeech = ({ editor }: { editor: any }) => {
	const [isListening, setIsListening] = useState(false);

	const recognition = useRef<SpeechRecognition | null>(null);

	const [, setState] = useAtom(editorAtom);

	useEffect(() => {
		const grammar =
			'#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;';

		const speechRecognitionList = new webkitSpeechGrammarList();

		speechRecognitionList.addFromString(grammar, 1);

		recognition.current = new (webkitSpeechRecognition || SpeechRecognition)();
		recognition.current.grammars = speechRecognitionList;
		recognition.current.continuous = true;
		recognition.current.lang = 'en-IN';
		recognition.current.interimResults = false;
		recognition.current.maxAlternatives = 1;

		recognition.current.onresult = (event: any) => {
			const results = event.results;
			const len = Object.keys(results).length;

			// TODO: Clean log results
			console.log(results);

			for (let i = 0; i < len; i++) {
				const transcript = results[i][0].transcript;
				// editor?.commands.insertContent(transcript);
				setState(transcript);

				console.log({ transcript });
			}
		};

		recognition.current.onspeechend = stopRecognition;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setState]);

	const startRecognition = useCallback(() => {
		if (!recognition.current) return null;

		recognition.current.start();
		speechLog('Started');
		setIsListening(true);
	}, []);

	const stopRecognition = useCallback(() => {
		if (!recognition.current) return null;

		recognition.current.stop();
		speechLog('Stopped');
		setIsListening(false);
	}, []);

	return {
		startRecognition,
		stopRecognition,
		recognition,
		isListening,
	};
};

export default useSpeech;
