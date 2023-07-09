import { User, UserProfile } from '@/lib/DTO/AppData';
import fetchWithToken from '@/lib/fetch.util';
import UserProfileUI from '@/components/UserUI/UserProfileLayout';
import { serverFetch } from '@/lib/fetch.util';
import { notFound} from "next/navigation";

const UserPage = async ({ params }: { params: { id: string } }) => {

	const user: any = await serverFetch<Promise<any>>(`/users/profile/${params.id}`);

	if (user.error) {
		notFound();
	}

	return (
		<UserProfileUI UserInfo={user as UserProfile} isUser={false}/>
	);
};

export default UserPage;