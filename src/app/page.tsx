import { redirect } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';

const Page = async () => {
	const session = await getSession();

	if (session?.user) {
		redirect('/chat');
	}

	return (
		<div className='h-screen w-full flex items-center justify-center'>
			<div className='flex flex-col gap-4 min-w-[200px] text-center'>
				Hi there, Please create new account or sign in to get started.
				<a href='/api/auth/login' className='btn btn-sm btn-primary capitalize'>
					Login or Sign Up
				</a>
			</div>
		</div>
	);
};

export default Page;
