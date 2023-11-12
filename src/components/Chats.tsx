import React, { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useUser } from '@auth0/nextjs-auth0/client';
import dayjs from 'dayjs';

import { chatsAtom } from '@/store';
import { getConfig } from '@/utils/config';

const Chats = () => {
	const chats = useAtomValue(chatsAtom);
	const { user } = useUser();

	useEffect(() => {
		const chats = document.querySelectorAll('.chat');

		if (!chats.length) return;

		chats[chats.length - 1].scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	}, [chats]);

	const userInfo = useCallback(
		(variation: string) => ({
			user: {
				containerClassNames: 'chat-end',
				messageClassNames: 'chat-bubble-info',
				name: user?.nickname,
				imageSrc: user?.picture,
			},
			assistant: {
				containerClassNames: 'chat-start',
				messageClassNames: 'chat-bubble-primary',
				name: getConfig('variation'),
				imageSrc: `/${variation}.jpg`,
			},
		}),
		[user],
	);

	return (
		<section className='h-full w-full relative'>
			<div className='h-[calc(100vh-100px)] absolute top-0 right-0 left-0 bottom-[80px] pt-20 pb-4 px-8 overflow-x-auto'>
				{chats.length ? (
					chats.map(({ type, message, time, variation }, index) => {
						const { containerClassNames, imageSrc, messageClassNames, name } =
							userInfo(variation)[type];

						return (
							<div key={index} className={`chat ${containerClassNames}`}>
								<div className='chat-image avatar'>
									<div className='w-10 rounded-full'>
										<img src={imageSrc} alt={name} />
									</div>
								</div>
								<div className='chat-header'>
									<span className='capitalize'>{name}</span>
									<time className='text-xs opacity-50 ml-1'>
										{dayjs(time).format('hh:mm A')}
									</time>
								</div>
								<div className={`chat-bubble ${messageClassNames}`}>
									{message}
								</div>
							</div>
						);
					})
				) : (
					<div className='hero min-h-[250px] bg-base-200 text-sky-200 border-2 rounded-3xl border-sky-200 shadow-[0_0_1px_#fff,inset_0_0_1px_#fff,0_0_2px_#08f,0_0_6px_#08f,0_0_15px_#08f]'>
						<div className='hero-content text-center'>
							<div className='max-w-md'>
								<h1 className='text-5xl font-bold capitalize'>
									Hello {user?.nickname || 'there'},{' '}
									<span className='animate-wave'>👋</span>
								</h1>
								<p className='py-6 italic'>
									{getConfig('text-input')
										? `Type in the input box in the bottom and start chatting. You can also change settings from the hamburger menu in the top left corner.`
										: `Tap the mic button in the bottom right corner and start speaking. You can also change settings from the hamburger menu in the top left corner.`}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default Chats;
