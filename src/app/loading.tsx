import React from 'react';

const Loading = () => (
	<div
		className='h-screen w-screen flex items-center justify-center'
		aria-label='Loading. Please wait...'
		aria-hidden='true'>
		<span className='loading loading-ball loading-xs'></span>
		<span className='loading loading-ball loading-sm'></span>
		<span className='loading loading-ball loading-md'></span>
		<span className='loading loading-ball loading-lg'></span>
	</div>
);

export default Loading;
