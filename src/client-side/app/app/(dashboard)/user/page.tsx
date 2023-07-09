// import fetchWithToken from "@/lib/fetch.util";
import { User, UserProfile } from "@/lib/DTO/AppData";
import CurrentUserId from "@/lib/token.util";
import UserProfileUI from "@/components/UserUI/UserProfileLayout";

const Users = async () => {

	return (
		<UserProfileUI  isUser={true}/>
	);
};
  
  export default Users;