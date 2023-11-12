import { useAtomValue } from 'jotai';

import { chatLoading } from '@/store';
import useSpeech from '@/hooks/useSpeech';

const Voice = () => {
	const isChatResponseLoading = useAtomValue(chatLoading);

	const { startRecognition, stopRecognition, isListening } = useSpeech();

	const toggleClasses = isListening
		? 'bg-purple-500 text-slate-50 shadow-xl shadow-primary'
		: '';

	return (
		<div className='flex justify-center absolute bottom-0 right-0 my-12 mx-8'>
			<button
				className={`p-3 bg-primary rounded-full flex items-center justify-center hover:text-gray-300 hover:shadow-xl hover:shadow-slate-700 ${toggleClasses}`}
				onClick={isListening ? stopRecognition : startRecognition}>
				{isChatResponseLoading ? (
					<span className='loading loading-spinner text-white'></span>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'>
						<path d='M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z' />
						<path d='M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z' />
					</svg>
				)}
				<span className='sr-only'>
					{isListening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
				</span>
			</button>
		</div>
	);
};

export default Voice;
