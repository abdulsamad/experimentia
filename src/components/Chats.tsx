import { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useUser } from '@auth0/nextjs-auth0/client';

import { chatLoading, chatsAtom, configAtom } from '@/store';
import Chat from './Chat';

const Chats = () => {
	const chats = useAtomValue(chatsAtom);
	const isChatResponseLoading = useAtomValue(chatLoading);
	const { textInput } = useAtomValue(configAtom);
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
		(variation: string | null) => ({
			user: {
				containerClassNames: 'chat-end',
				messageClassNames: 'chat-bubble-info',
				name: user?.nickname,
				userImageSrc: user?.picture as string,
			},
			assistant: {
				containerClassNames: 'chat-start',
				messageClassNames: 'chat-bubble-primary',
				name: variation,
				userImageSrc: `/icons/${variation}.jpg`,
			},
		}),
		[user],
	);

	return (
		<section className='h-full w-full relative'>
			<div className='h-[calc(100vh-180px)] absolute top-0 right-0 left-0 bottom-[80px] pt-8 pb-4 px-3 lg:px-8 overflow-x-auto'>
				{chats.length ? (
					<>
						{chats.map((chat, index) => {
							const { variation, type } = chat;

							return (
								<Chat key={index} {...userInfo(variation)[type]} {...chat} />
							);
						})}
						{isChatResponseLoading && (
							<div className='chat chat-start'>
								<div className='chat-bubble chat-bubble-primary'>
									<div className='flex items-center justify-center gap-1 h-6'>
										<div className='w-1 h-1 bg-slate-200 rounded-[50%] animate-typing'></div>
										<div className='w-1 h-1 bg-slate-200 rounded-[50%] animate-typing [animation-delay:150ms]'></div>
										<div className='w-1 h-1 bg-slate-200 rounded-[50%] animate-typing [animation-delay:300ms]'></div>
									</div>
								</div>
							</div>
						)}
					</>
				) : (
					<div className='hero min-h-[250px] bg-base-200 text-sky-200 border-2 rounded-3xl border-sky-200 shadow-[0_0_1px_#fff,inset_0_0_1px_#fff,0_0_2px_#08f,0_0_6px_#08f,0_0_15px_#08f]'>
						<div className='hero-content text-center'>
							<div className='max-w-md'>
								<h1 className='text-5xl font-bold capitalize break-all'>
									Hello {user?.nickname || 'there'},{' '}
									<span className='animate-wave'>👋</span>
								</h1>
								<h1 className='py-6 italic break-words [text-wrap:pretty]'>
									{textInput
										? `Type in the input box in the bottom and start chatting. You can also change settings from the hamburger menu in the top left corner.`
										: `Tap the mic button in the bottom right corner and start speaking. You can also change settings from the hamburger menu in the top left corner.`}
								</h1>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default Chats;
