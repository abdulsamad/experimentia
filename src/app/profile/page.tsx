import { redirect } from 'next/navigation';
import { getSession } from '@auth0/nextjs-auth0';
import Image from 'next/image';

const Profile = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	const user = session.user;

	return (
		<div className='h-screen w-full flex items-center justify-center'>
			<div className='flex flex-col items-center justify-center gap-4'>
				<Image
					className='rounded-full'
					src={user.picture}
					height={100}
					width={100}
					alt={user.name}
				/>
				<div className='flex'>
					<b>Name:</b>&nbsp;<h2>{user.name}</h2>
				</div>
				<div className='flex'>
					<b>Email:</b>&nbsp;<p>{user.email}</p>
				</div>
				<div className='my-2'>
					<button className='btn btn-sm btn-secondary'>Logout</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
