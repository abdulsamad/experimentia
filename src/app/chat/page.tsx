'use client';
import { Provider } from 'jotai';

import store from '@/store';
import Editor from '@/components/Editor';

const Home = () => {
	return (
		<Provider store={store}>
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
