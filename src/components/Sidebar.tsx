import React, { ChangeEvent, useCallback, useLayoutEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useSetAtom, useAtomValue } from 'jotai';

import { flagsAtom, identifierAtom } from '@/store';
import { languages } from '@/utils/languages';
import { getConfig, setConfig } from '@/utils/config';
import Chats from './Chats';

const Sidebar = () => {
	const flags = useAtomValue(flagsAtom);
	const { user } = useUser();
	const setIdentifier = useSetAtom(identifierAtom);

	useLayoutEffect(() => {
		if (!user?.email) return;

		setIdentifier(user?.email);
	}, [user?.email, setIdentifier]);

	const updateSetting = useCallback(
		({ target }: ChangeEvent<HTMLSelectElement>) => {
			const { name, value } = target;
			setConfig({ [name]: value });
		},
		[],
	);

	const updatedCheckedSetting = useCallback(
		({ target }: ChangeEvent<HTMLInputElement>) => {
			const { name, checked } = target;
			setConfig({ [name]: checked });
		},
		[],
	);

	return (
		<div className='drawer z-50'>
			<input id='sidebar' type='checkbox' className='drawer-toggle' />
			<div className='drawer-content flex flex-col items-center justify-center'>
				{/* Page content here */}
				{/* Test Content */}
				{/* Page content here */}
				<label
					htmlFor='sidebar'
					className='btn btn-primary drawer-button absolute top-0 left-0 m-4'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
						/>
					</svg>
					<span className='sr-only'>Open Drawer</span>
				</label>
			</div>
			<aside className='drawer-side'>
				<label
					htmlFor='sidebar'
					aria-label='close sidebar'
					className='drawer-overlay'></label>
				<ul className='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
					<li>
						<div className='form-control flex flex-col w-full max-w-xs'>
							<label className='label'>
								<span className='label-text'>Variation</span>
							</label>
							<select
								name='variation'
								className='select select-bordered w-full'
								defaultValue={getConfig('variation')}
								onChange={updateSetting}>
								<option value='normal' disabled={!flags?.normalEnabled}>
									Normal
								</option>
								<option value='grammar-corrector'>Grammar Corrector</option>
								<option value='munna'>Munna Bhai</option>
								<option value='intelligent'>Intelligent AI</option>
							</select>
						</div>
					</li>
					<li>
						<div className='form-control flex flex-col w-full max-w-xs'>
							<label className='label'>
								<span className='label-text'>Model</span>
							</label>
							<select
								name='model'
								className='select select-bordered w-full'
								defaultValue={getConfig('model')}
								onChange={updateSetting}>
								<option value='gpt-3.5-turbo'>GPT 3.5 (Chat GPT)</option>
								<option value='gpt-4' disabled={!flags?.gpt4Enabled}>
									GPT 4
								</option>
							</select>
						</div>
					</li>
					<li>
						<div className='form-control flex flex-col w-full max-w-xs'>
							<label className='label'>
								<span className='label-text'>Language</span>
							</label>
							<select
								name='language'
								className='select select-bordered w-full'
								defaultValue={getConfig('language')}
								onChange={(ev) => {
									updateSetting(ev);
									window.location.reload();
								}}>
								{languages.map(({ code, text }) => (
									<option key={code} value={code}>
										{text}
									</option>
								))}
							</select>
							<label className='label'>
								<span className='label-text-alt'>
									Page will reload to take effect
								</span>
							</label>
						</div>
					</li>
					<li>
						<div className='form-control flex w-full max-w-xs'>
							<label className='label'>
								<span className='label-text'>Input Type</span>
							</label>
							<div className='flex items-center justify-center space-x-4'>
								<span>Voice</span>
								<input
									name='text-input'
									type='checkbox'
									checked={getConfig('text-input')}
									onChange={(ev) => {
										updatedCheckedSetting(ev);
										window.location.reload();
									}}
									className='toggle toggle-lg'
								/>
								<span>Text</span>
							</div>
							<label className='label'>
								<span className='label-text-alt text-center'>
									How you want to give input to GPT? <br /> Page will reload to
									take effect
								</span>
							</label>
						</div>
					</li>
					<li className='mt-auto'>
						<div className='mx-auto flex flex-col gap-3'>
							<div className='avatar'>
								<div className='w-24 rounded-full'>
									<img
										src={user?.picture as string}
										alt={user?.name as string}
									/>
								</div>
							</div>
							<span>
								Name: <strong>{user?.nickname}</strong>
							</span>
							<span>
								Email: <strong>{user?.email}</strong>
							</span>
						</div>
					</li>
					<li className='mt-auto'>
						<div className='my-5 mx-auto'>
							<a
								href='/api/auth/logout'
								className='btn btn-secondary btn-sm btn-wide h-12'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth={1.5}
									stroke='currentColor'
									className='w-6 h-6'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
									/>
								</svg>
								Logout
							</a>
						</div>
					</li>
				</ul>
			</aside>
		</div>
	);
};

export default Sidebar;
