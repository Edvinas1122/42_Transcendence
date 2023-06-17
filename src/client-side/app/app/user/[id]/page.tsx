import { User } from '@/app/dtos/AppData';
import fetchWithToken from '@/lib/fetch.util';

const UserPage = async ({ params }: { params: { id: string } }) => {

	const user: User = await fetchWithToken<User>(`/users/profile/${params.id}`, 30);
	return (
		<div>
			<h1>User Profile {params.id} </h1>
			<h1>
				{user.name}
			</h1>
		</div>
	);
};

export default UserPage;