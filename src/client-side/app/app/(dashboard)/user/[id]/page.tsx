import { User, UserProfile } from '@/lib/DTO/AppData';
import fetchWithToken from '@/lib/fetch.util';
import UserProfileUI from '@/components/UserUI/UserProfileUI';
import { serverFetch } from '@/lib/fetch.util';
import { notFound} from "next/navigation";

const UserPage = async ({ params }: { params: { id: string } }) => {

	const user: Promise<Response | UserProfile> = await serverFetch<Promise<Response>>(`/users/profile/${params.id}`);

	if (user.error) {
		notFound();
	}

	return (
		<UserProfileUI UserInfo={user} isUser={false}/>
	);
};

export default UserPage;