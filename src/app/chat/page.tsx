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
			<main className='conic-gradient(at right center, rgb(199, 210, 254), rgb(71, 85, 105), rgb(199, 210, 254))'>
				<Sidebar />
				<div className='flex flex-col justify-end'>
					<Editor />
				</div>
			</main>
		</Provider>
	);
};

export default Home;
