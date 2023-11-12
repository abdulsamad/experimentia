import { redirect } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';

const Page = async () => {
	const session = await getSession();

	if (session?.user) {
		redirect('/chat');
	}

	return (
		<div className='h-screen w-full flex items-center justify-center'>
			<a href='/api/auth/login' className='btn btn-primary'>
				Login
			</a>
		</div>
	);
};

export default Page;
