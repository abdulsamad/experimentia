'use client';
import React, { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';
import { Provider } from 'jotai';
import { useUser } from '@auth0/nextjs-auth0/client';

import Editor from '@/components/Editor';
import Sidebar from '@/components/Sidebar';

const Home = () => {
	const { user, isLoading } = useUser();

	useLayoutEffect(() => {
		if (!user) redirect('/');
	}, [user]);

	if (isLoading) return null;

	return (
		<Provider>
			<main className='bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900'>
				<Sidebar />
				<div className='flex flex-col justify-end h-screen w-full'>
					<Editor />
				</div>
			</main>
		</Provider>
	);
};

export default Home;
