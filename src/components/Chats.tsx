import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useUser } from '@auth0/nextjs-auth0/client';
import dayjs from 'dayjs';

import { chatsAtom } from '@/store';
import { getConfig } from '@/utils/config';

const Chats = () => {
	const chats = useAtomValue(chatsAtom);
	const { user } = useUser();

	const userInfo = useMemo(
		() => ({
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
				imageSrc: 'https://xsgames.co/randomusers/avatar.php?g=male',
			},
		}),
		[user],
	);

	return (
		<section className='h-full w-full pt-24 px-5'>
			{chats.length ? (
				chats.map(({ type, message, time }, index) => {
					const { containerClassNames, imageSrc, messageClassNames, name } =
						userInfo[type];

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
							<div className={`capitalize chat-bubble ${messageClassNames}`}>
								{message}
							</div>
						</div>
					);
				})
			) : (
				<div className='hero h-[250px] bg-base-200 rounded-3xl shadow'>
					<div className='hero-content text-center'>
						<div className='max-w-md'>
							<h1 className='text-5xl font-bold'>
								Hello there, <span className='animate-bounce'>👋</span>
							</h1>
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
