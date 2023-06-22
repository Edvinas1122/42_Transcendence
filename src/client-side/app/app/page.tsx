import { Metadata } from 'next';
import fetchWithToken from '@/lib/fetch.util';
import UserProfileInfo from '@/components/UserUI/UserProfileDisplay';
import { User } from '@/lib/DTO/AppData';
import CurrentUserId from '@/lib/token.dev.util';

export const metadata: Metadata = {
	title: 'Profile',
	description: 'User Profile'
}

const Page: Function = async () => {

	// const user: User = await fetchWithToken<User>(`/users/profile/${}`);
	const user: User = await fetchWithToken<User>(`/users/me`);


	return (
		<UserProfileInfo UserInfo={user} />
	);
}

export default Page;