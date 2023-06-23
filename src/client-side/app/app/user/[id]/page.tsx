import { User } from '@/lib/DTO/AppData';
import fetchWithToken from '@/lib/fetch.util';
import UserProfileInfo from '@/components/UserUI/UserProfileDisplay'
import UserProfileUI from '@/components/UserUI/UserProfileUI';

const UserPage = async ({ params }: { params: { id: string } }) => {

	const user: User = await fetchWithToken<User>(`/users/profile/${params.id}`, 30);

	return (
		<UserProfileUI UserInfo={user} isUser={false}/>
	);
};

export default UserPage;