// import { cookies } from 'next/headers';
import fetchWithToken from '@/lib/fetch.util';
import { User } from '@/app/dtos/AppData';
import Link from 'next/link';
import AllUsersDisplay from './AllUsersDisplay';


const FriendsAndUsersPage = async () => {

	const Users: User[] = await fetchWithToken<User[]>("/users/all", 1);

	return (
	  <div>
		<AllUsersDisplay Users={Users} />
	  </div>
	);
  };
  
  export default FriendsAndUsersPage;