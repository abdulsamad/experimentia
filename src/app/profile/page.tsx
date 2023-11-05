import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';

const Profile = async () => {
	const session = await getSession();

	if (session?.user) {
		const user = session.user;

		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<div className='flex flex-col items-center justify-center gap-4'>
					<img
						className='rounded-full'
						height={100}
						width={100}
						src={user.picture}
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
	}

	return (
		<div className='h-screen w-full flex items-center justify-center'>
			<a href='/api/auth/login' className='btn btn-primary'>
				Login
			</a>
		</div>
	);
};

export default Profile;
