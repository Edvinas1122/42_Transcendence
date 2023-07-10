// import fetchWithToken from "@/lib/fetch.util";
import { User, UserProfile } from "@/lib/DTO/AppData";
import CurrentUserId from "@/lib/token.util";
import UserProfileUI from "@/components/UserUI/UserProfileLayout";
import fetchWithToken from "@/lib/fetch.util";


const Users = async () => {

	const id: number = CurrentUserId();
	const UserInfo: UserProfile = await fetchWithToken<UserProfile>(`/users/profile/${id}`);

	return (
		<UserProfileUI UserInfo={UserInfo} isUser={true}/>
	);
};
  
  export default Users;