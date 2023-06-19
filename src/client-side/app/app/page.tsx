import { Metadata } from 'next'
import { cookies } from 'next/headers'
import fetchWithToken from '@/lib/fetch.util'
import UserProfileInfo from '@/components/UserUI/UserProfileDisplay'
import { User } from '@/lib/DTO/AppData'

export const metadata: Metadata = {
	title: 'Profile',
	description: 'User Profile'
}

const Page = async () => {

	const user: User = await fetchWithToken<User>(`/users/me`);

	return (
		<UserProfileInfo UserInfo={user} />
	);
}

export default Page;