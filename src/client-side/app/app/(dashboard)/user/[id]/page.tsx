import { User } from '@/lib/DTO/AppData';
import fetchWithToken from '@/lib/fetch.util';
import UserProfileInfo from '@/components/UserUI/UserProfileDisplay'

const UserPage = async ({ params }: { params: { id: string } }) => {

	const user: User = await fetchWithToken<User>(`/users/profile/${params.id}`, 30);

	return (
		<UserProfileInfo UserInfo={user} />
	);
};

export default UserPage;