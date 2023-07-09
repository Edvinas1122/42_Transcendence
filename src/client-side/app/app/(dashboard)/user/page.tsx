import fetchWithToken from "@/lib/fetch.util";
import { User } from "@/lib/DTO/AppData";
import CurrentUserId from "@/lib/token.util";
import UserProfileUI from "@/components/UserUI/UserProfileUI";

const Users = async () => {

	const id: number = CurrentUserId();
	const user: User = await fetchWithToken<User>(`/users/profile/${id}`);

	console.log("user", user);

	return (
		<UserProfileUI UserInfo={user} isUser={true}/>
	);
  };
  
  export default Users;