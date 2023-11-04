'use client';
import { Provider } from 'jotai';

import store from '@/store';
import Editor from '@/components/Editor';

const Home = () => {
	return (
		<Provider store={store}>
			<main className='p-5'>
				<Editor />
			</main>
		</Provider>
	);
};

export default Home;
