import Link from "next/link";
import UIListBox from "../GeneralUI/GenericList";
import GenericForm from "../GeneralUI/GenericForm";
import { User } from "@/lib/DTO/AppData";
import fetchWithToken, { serverFetch } from "@/lib/fetch.util";
import "@/public/layout.css";
import "./Friends.css";
import GenericButton from "../GeneralUI/GenericButton";
import { BlockedUserBox, FriendRequestBox } from "./FriendInteract";
import InvitesLive from "./live/InvitesLive";
import AllUsersLive from "./live/AllUsersLive";
import UserBox from "./UserBox";
import FriendsLive from "./live/FriendsLive";
import BlockedUsersLive from "./live/BlockedUsersLive";

const	FriendsUI: Function = () => {

	return (		
		<div className="Display">
			<div className="Segment">
				<div className="Component">
					<h1>Invites</h1>
					<InvitesLive node={UserBox}/>
					<h1>Friends</h1>
					<FriendsLive node={UserBox}/>
					<h1>Blocked</h1>
					<BlockedUsersLive node={UserBox}/>
					
				</div>
			</div>
			<div className="Segment">
				<div className="Component">
					<h1>All Users</h1>
					<AllUsersLive node={UserBox}/>
				</div>
			</div>
		</div>
	);
}

export default FriendsUI;