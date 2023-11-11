import React from 'react';
import { useAtom } from 'jotai';

import { chatsAtom } from '@/store';

const Chats = () => {
	const [chats] = useAtom(chatsAtom);

	return (
		<section className='h-full w-full pt-24 px-5'>
			{chats.length ? (
				chats.map(({ type, message }, index) => {
					const containerClassNames =
						type === 'assistant' ? 'chat-start' : 'chat-end';
					const messageClassNames =
						type === 'assistant' ? 'chat-bubble-primary' : 'chat-bubble-info';

					return (
						<div key={index} className={`chat ${containerClassNames}`}>
							<div className={`capitalize chat-bubble ${messageClassNames}`}>
								{message}
							</div>
						</div>
					);
				})
			) : (
				<div className='hero h-[250px] bg-base-200'>
					<div className='hero-content text-center'>
						<div className='max-w-md'>
							<h1 className='text-5xl font-bold'>Hello there, 👋</h1>
							<p className='py-6'>
								Tap the mic button in the bottom right corner and start
								speaking. You can also change setting from the hamburger menu in
								the top left corner.
							</p>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default Chats;
