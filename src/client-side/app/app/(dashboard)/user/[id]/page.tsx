import { User, UserProfile } from '@/lib/DTO/AppData';
import fetchWithToken from '@/lib/fetch.util';
import UserProfileInfo from '@/components/UserUI/UserProfileDisplay'
import UserProfileUI from '@/components/UserUI/UserProfileUI';
import { serverFetch } from '@/lib/fetch.util';

const UserPage = async ({ params }: { params: { id: string } }) => {

	const user: UserProfile = await serverFetch<UserProfile>(`/users/profile/${params.id}`);

	return (
		<UserProfileUI UserInfo={user} isUser={false}/>
	);
};

export default UserPage;