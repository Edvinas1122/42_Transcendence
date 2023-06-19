import fetchWithToken from '@/lib/fetch.util';
import { User } from '@/lib/DTO/AppData';
import AllUsersDisplay from '@/app/friends/AllUsersDisplay'


const FriendsAndUsersPage = async () => {

	const Users: User[] = await fetchWithToken<User[]>("/users/all", 1);

	return (
	  <div>
		<AllUsersDisplay Users={Users} />
	  </div>
	);
  };
  
  export default FriendsAndUsersPage;