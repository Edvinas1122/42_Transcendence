import { Metadata } from 'next';
import { User } from '@/lib/DTO/AppData';
// import CurrentUserId from '@/lib/token.dev.util';
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Profile',
	description: 'User Profile'
}

const Page: Function = async () => {

	// const user: User = await fetchWithToken<User>(`/users/profile/${}`);
	// const user: User = await fetchWithToken<User>(`/users/me`);

	
	redirect('/user');
	// return (
		// <UserProfileUI UserInfo={user} isUser={true}/>
	// );
}

export default Page;