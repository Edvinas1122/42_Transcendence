import fetchWithToken from '@/lib/fetch.util';
import { User } from '@/lib/DTO/AppData';
import AllUsersDisplay from '@/components/FriendsUI/AllUsersList'
import UserListBox, { LinkUserBox, UserBox } from '@/components/FriendsUI/UserListBox'
import UsersListDisplay from '@/components/FriendsUI/UserListBox';

const FriendsDummy: User[] = [
	{
		_id: "1",
		name: "John",
		avatar: "",
		Online: true,
	},
	{
		_id: "2",
		name: "Jane",
		avatar: "",
		Online: false,
	},
	{
		_id: "3",
		name: "Jack",
		avatar: "",
		Online: true,
	},
	{
		_id: "4",
		name: "Jill",
		avatar: "",
		Online: false,
	},
];

const InvitesDummy: User[] = [
	{
		_id: "5",
		name: "John",
		avatar: "",
		// Online: true,
	},
	{
		_id: "6",
		name: "Jane",
		avatar: "",
		// Online: false,
	},
	{
		_id: "7",
		name: "Jack",
		avatar: "",
		// Online: true,
	},
	{
		_id: "8",
		name: "Jill",
		avatar: "",
		// Online: false,
	},
];

const FriendsAndUsersPage: Function = async () => {

	const AllUsers: User[] = await fetchWithToken<User[]>("/users/all", 1);
	// const Friends: User[] = await fetchWithToken<User[]>("/users/friends", 1);
	const Frineds: User[] = FriendsDummy;
	// const Invites: User[] = await fetchWithToken<User[]>("/users/manage/get-all-pending-friend-request", 1);
	const Invites: User[] = InvitesDummy;

	return (
		<section>
			<div>
				<div>
					<UsersListDisplay Users={Invites} BoxComponent={UserListBox} Title="Invites" />
				</div>
				<div>
					<UsersListDisplay Users={AllUsers} BoxComponent={LinkUserBox} Title="All Users" />
				</div>
	  		</div>
			<div>
				<UsersListDisplay Users={Frineds} BoxComponent={UserBox} Title="Friends" />
			</div>
		</section>
	);
  };
  
  export default FriendsAndUsersPage;