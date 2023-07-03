import Link from "next/link";
import UIListBox from "../GeneralUI/GenericList";
import GenericForm from "../GeneralUI/GenericForm";
import { User } from "@/lib/DTO/AppData";
import fetchWithToken from "@/lib/fetch.util";
import "@/public/layout.css";
import "./Friends.css";
import InvitesLive from "./live/InvitesLive";


const	FriendsDummy: User[] = [
	{
		_id: 1,
		name: "John",
		avatar: "",
		Online: true,
	},
	{
		_id: 2,
		name: "Jane",
		avatar: "",
		Online: false,
	},
	{
		_id: 3,
		name: "Jack",
		avatar: "",
		Online: true,
	},
	{
		_id: 4,
		name: "Jill",
		avatar: "",
		Online: false,
	},
]


export const LinkUserBox: Function = ({ item }: { item: User }) => {
	return (
	  <Link href={`/user/${item._id}`}>
		<UserBox item={item} />
	  </Link>
	);
}

export const UserBox: React.FC<{ item: User }> = ({ item }: { item: User }) => {
	return (
	  <div className="Entity">
		<p>
		  <strong>{item.name}</strong>
		  <span>{item.name}</span>
		</p>
		  <div className="status"></div>
	  </div>
	);
}

const	FriendsUI: Function = async () => {

	// const Friends: User[] = await fetchWithToken<User[]>("/users/manage/friends/");
	const Friends: User[] = FriendsDummy;
	const Invites: User[] = await fetchWithToken<User[]>("/users/manage/get-all-pending-friend-request/");
	const AllUsers: User[] = await fetchWithToken<User[]>("/users/all");

	return (		
		<div className="Display">
			<div className="Segment">
				<div className="Component">
					<h1>Invites</h1>

					{/* <UIListBox Items={Invites} BoxComponent={LinkUserBox} ListStyle="Invited"  /> */}
					<InvitesLive node={UserBox}/>
					<h1>Friends</h1>
					<UIListBox Items={Friends} BoxComponent={LinkUserBox} ListStyle="Friends"  />
				</div>
			</div>
			<div className="Segment">
				<div className="Component">
					<h1>All Users</h1>
					<UIListBox Items={AllUsers} BoxComponent={LinkUserBox} ListStyle="AllUsers" />
				</div>
			</div>
		</div>
	);
}

export default FriendsUI;