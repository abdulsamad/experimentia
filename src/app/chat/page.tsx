'use client';
import React, { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';
import { Provider } from 'jotai';
import { useUser } from '@auth0/nextjs-auth0/client';

import Editor from '@/components/Editor';

const Home = () => {
	const { user, isLoading } = useUser();

	useLayoutEffect(() => {
		if (!user) redirect('/');
	}, [user]);

	if (isLoading) return null;

	return (
		<Provider>
			<main className='p-5'>
				<div className='mb-5 flex justify-end'>
					<a href='/api/auth/logout' className='btn btn-secondary btn-sm'>
						Logout
					</a>
				</div>
				<Editor />
			</main>
		</Provider>
	);
};

export default Home;
