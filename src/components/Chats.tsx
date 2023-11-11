import React, { useEffect, useMemo } from 'react';
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
		<section className='h-full w-full pt-24 px-8 py-2'>
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
				<div className='hero h-[250px] bg-base-200 text-sky-200 border-2 rounded-3xl border-sky-200 shadow-[0_0_1px_#fff,inset_0_0_1px_#fff,0_0_2px_#08f,0_0_6px_#08f,0_0_15px_#08f]'>
					<div className='hero-content text-center'>
						<div className='max-w-md'>
							<h1 className='text-5xl font-bold'>
								Hello {user?.nickname || 'there'},{' '}
								<span className='animate-wave'>👋</span>
							</h1>
							<p className='py-6'>
								Tap the mic button in the bottom right corner and start
								speaking. You can also change settings from the hamburger menu
								in the top left corner.
							</p>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default Chats;
