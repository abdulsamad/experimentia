'use client';

import { Provider } from 'jotai';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Editor from '@/components/Editor';
import Sidebar from '@/components/Sidebar';
import Chats from '@/components/Chats';

const Home = () => {
	return (
		<Provider>
			<main className='conic-gradient(at right center, rgb(199, 210, 254), rgb(71, 85, 105), rgb(199, 210, 254))'>
				<Sidebar />
				<Chats />
				<div className='flex flex-col justify-end'>
					<Editor />
				</div>
			</main>
		</Provider>
	);
};

export default withPageAuthRequired(Home);
