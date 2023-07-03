import fetchWithToken from "@/lib/fetch.util";
import { User } from "@/lib/DTO/AppData";
import UserProfileInfo from "@/components/UserUI/UserProfileDisplay";
import CurrentUserId from "@/lib/token.util";

const Users = async () => {

	const id: number = CurrentUserId();
	const user: User = await fetchWithToken<User>(`/users/profile/${id}`);

	return (
		<UserProfileInfo UserInfo={user} />
	);
  };
  
  export default Users;