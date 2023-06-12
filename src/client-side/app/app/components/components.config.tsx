import PersonalProfile from "./UserProfile/Profiles";
import Chats from "./Chat/Chat";
// import { User, GroupChat } from '@/app/dtos/AppData';
import { Link } from 'react-router-dom';
import { EventType } from "../dtos/EventData";

const FriendsAndUsers = () => (
    <div>
        <Link to="/user/Jonas">View Jonas Profile</Link>
    </div>
);
const GameQue = () => <div>View 4</div>;


const AppDisplays = [
	{
		component: PersonalProfile,
		name: "Personal Profile",
		props: {},
		propsFetchAPI: "/users/me",
		subscibe: "profile"
	},
	{
		component: Chats,
		name: "Chats",
		props: [],
		propsFetchAPI: "/chat/available",
		subscibe: "chat"
	},
	{
		component: FriendsAndUsers,
		name: "Friends and Users",
		props: {},
		subscibe: ""

	},
	{
		component: GameQue,
		name: "Game Que",
		props: {},
		subscibe: ""
	}
];

export default AppDisplays;