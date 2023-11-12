'use client';

import Text from '@/components/Inputs/Text';
import Voice from '@/components/Inputs/Voice';
import { getConfig } from '@/utils/config';

const Editor = () => {
	const isTextInput = getConfig('text-input');

	return (
		<div className='flex flex-col fixed bottom-0 left-0 right-0'>
			{isTextInput ? <Text /> : <Voice />}
		</div>
	);
};

export default Editor;
